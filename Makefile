.PHONY: inflated

%.zip:
	mkdir -p nodejs/node_modules/chrome-aws-lambda/
	cd nodejs/ && npm install puppeteer-core@~1.15.0 --no-bin-links --no-optional --no-package-lock --no-save --no-shrinkwrap && cd -
	npm pack
	tar --directory nodejs/node_modules/chrome-aws-lambda/ --extract --file chrome-aws-lambda-*.tgz --strip-components=1
	rm chrome-aws-lambda-*.tgz
	mkdir -p $(dir $@)
	zip -9 --filesync --move --recurse-paths $@ nodejs/

inflated: bin/chromium-*.br
	brotli --decompress --rm bin/chromium-*.br
