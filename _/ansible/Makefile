.PHONY: ansible iltorb chromium

ansible:
	sudo pip install boto boto3

iltorb:
	rm --force --recursive "$$PWD/../../node_modules/iltorb/"
	rm --force --recursive "$$PWD/../../source/iltorb/"
	docker run \
		--rm \
		--user $$(id -u "$$USER"):$$(id -g "$$USER") \
		--volume "$$PWD/../../":/srv/chrome-aws-lambda \
		--workdir /srv/chrome-aws-lambda node:8.10 \
	npm install --no-shrinkwrap --silent
	mkdir --parents "$$PWD/../../source/iltorb/build/"
	mv --target-directory="$$PWD/../../source/iltorb/" \
		"$$PWD/../../node_modules/iltorb/build/" \
		"$$PWD/../../node_modules/iltorb/index.js" \
		"$$PWD/../../node_modules/iltorb/LICENSE"

chromium:
	ansible-playbook plays/chromium.yml -i inventory.ini
