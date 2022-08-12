.PHONY: clean

clean:
	rm -rf chrome_aws_lambda.zip _/amazon/code/nodejs

pretest:
	unzip chrome_aws_lambda.zip -d _/amazon/code

test:
	sam local invoke --template _/amazon/template.yml --event _/amazon/events/example.com.json node16

.fonts.zip:
	zip -9 --filesync --move --recurse-paths .fonts.zip .fonts/

%.zip:
	npm install --no-fund --no-package-lock --no-shrinkwrap
	mkdir -p nodejs/
	npm install --prefix nodejs/ tar-fs@2.1.1 puppeteer-core@16.1.0 --no-bin-links --no-fund --omit=optional --no-package-lock --no-save --no-shrinkwrap
	npm pack
	mkdir -p nodejs/node_modules/@sparticuz/chrome-aws-lambda/
	tar --directory nodejs/node_modules/@sparticuz/chrome-aws-lambda/ --extract --file sparticuz-chrome-aws-lambda-*.tgz --strip-components=1
	rm sparticuz-chrome-aws-lambda-*.tgz
	mkdir -p $(dir $@)
	zip -9 --filesync --move --recurse-paths $@ nodejs/

.DEFAULT_GOAL := chrome_aws_lambda.zip
