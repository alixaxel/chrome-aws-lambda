.PHONY: ansible chromium iltorb

ansible:
	sudo pip install boto boto3

chromium:
	ansible-playbook plays/chromium.yml -i inventory.ini

iltorb:
	rm --force --recursive "$$PWD/../../node_modules/iltorb/"
	rm --force --recursive "$$PWD/../../source/iltorb/"
	docker run \
		--rm \
		--user $$(id -u "$$USER"):$$(id -g "$$USER") \
		--volume "$$PWD/../../":/srv/chrome-aws-lambda \
		--workdir /srv/chrome-aws-lambda node:10.15 \
	npm install --no-shrinkwrap --silent
	mkdir --parents "$$PWD/../../source/iltorb/build/"
	mv --target-directory="$$PWD/../../source/iltorb/" \
		"$$PWD/../../node_modules/iltorb/build/" \
		"$$PWD/../../node_modules/iltorb/index.js" \
		"$$PWD/../../node_modules/iltorb/LICENSE"
