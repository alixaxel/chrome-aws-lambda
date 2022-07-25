.PHONY: ansible chromium

ansible:
	pip install ansible boto boto3

chromium:
	ansible-playbook plays/chromium.yml -i inventory.ini
