'use strict';

exports.decompress = decompress;
exports.decompressSync = decompressSync;
exports.decompressStream = decompressStream;

const decode = require('./build/bindings/decode.node');
const Transform = require('stream').Transform;

class TransformStreamDecode extends Transform {
  constructor(params, sync) {
    super(params);
    this.sync = sync || false;
    this.decoder = new decode.StreamDecode(params || {});
  }

  _transform(chunk, encoding, next) {
    this.decoder.transform(chunk, (err, output) => {
      if (err) {
        return next(err);
      }
      this._push(output);
      next();
    }, !this.sync);
  }

  _flush(done) {
    this.decoder.flush((err, output) => {
      if (err) {
        return done(err);
      }
      this._push(output);
      done();
    }, !this.sync);
  }

  _push(output) {
    if (output) {
      for (let i = 0; i < output.length; i++) {
        this.push(output[i]);
      }
    }
  }
}

function decompress(input, params, cb) {
  if (arguments.length === 2) {
    cb = params;
    params = {};
  }
  if (!Buffer.isBuffer(input)) {
    process.nextTick(cb, new Error('Brotli input is not a buffer.'));
    return;
  }
  if (typeof cb !== 'function') {
    process.nextTick(cb, new Error('Second argument is not a function.'));
    return;
  }
  const stream = new TransformStreamDecode(params);
  const chunks = [];
  let length = 0;
  stream.on('error', cb);
  stream.on('data', function(c) {
    chunks.push(c);
    length += c.length;
  });
  stream.on('end', function() {
    cb(null, Buffer.concat(chunks, length));
  });
  stream.end(input);
}

function decompressSync(input, params) {
  if (!Buffer.isBuffer(input)) {
    throw new Error('Brotli input is not a buffer.');
  }
  const stream = new TransformStreamDecode(params, true);
  const chunks = [];
  let length = 0;
  stream.on('error', function(e) {
    throw e;
  });
  stream.on('data', function(c) {
    chunks.push(c);
    length += c.length;
  });
  stream.end(input);
  return Buffer.concat(chunks, length);
}

function decompressStream(params) {
  return new TransformStreamDecode(params);
}
