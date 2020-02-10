.PHONY: ansible chromium

ansible:
	sudo pip3 install boto boto3

chromium:
	ansible-playbook plays/chromium.yml -i inventory.ini
