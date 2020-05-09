.PHONY: ansible chromium

ansible:
	sudo pip3 install ansible boto boto3

chromium:
	ansible-playbook plays/chromium.yml -i inventory.ini
