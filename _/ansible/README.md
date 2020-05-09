# Chromium Playbook

This Ansible playbook will launch an EC2 `c5.9xlarge` Spot Instance and compile Chromium statically.

Once the compilation finishes, the binary will be compressed with Brotli and downloaded.

The whole process usually takes around 1 hour to on a `c5.9xlarge` instance.

## Chromium Version

To compile a specific version of Chromium, update the `puppeteer_version` variable in the Ansible inventory, i.e.:

```shell
puppeteer_version=v1.9.0
```

If not specified, the current `master` will be used.

## Usage

```shell
AWS_REGION=us-east-1 \
AWS_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXX \
AWS_SECRET_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \
make chromium
```

## Requirements

- [Ansible](http://docs.ansible.com/ansible/latest/intro_installation.html#latest-releases-via-apt-ubuntu)
- AWS SDK for Python (`boto` and `boto3`)
