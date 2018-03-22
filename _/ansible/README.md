# Chromium Playbook

This Ansible playbook will launch an EC2 `c5.9xlarge` Spot Instance and compile Chromium statically.

Once the compilation finishes, the binary will be compressed with Brotli and downloaded.

## Chromium Revision to Git Commit

- crrev.com/{REVISION}

Make sure to update the `chromium_commit` variable accordingly.

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
