.PHONY: clean

clean:
	rm -f $(lastword $(MAKECMDGOALS))

.fonts.zip:
	zip -9 --filesync --move --recurse-paths .fonts.zip .fonts/

%.zip:
	npm install --no-fund --no-package-lock --no-shrinkwrap
	mkdir -p nodejs/
	npm install --prefix nodejs/ tar-fs@2.1.1 puppeteer-core@14.1.1 --no-bin-links --no-fund --no-optional --no-package-lock --no-save --no-shrinkwrap
	npm pack
	mkdir -p nodejs/node_modules/@sparticuz/chrome-aws-lambda/
	tar --directory nodejs/node_modules/@sparticuz/chrome-aws-lambda/ --extract --file sparticuz-chrome-aws-lambda-*.tgz --strip-components=1
	rm sparticuz-chrome-aws-lambda-*.tgz
	mkdir -p $(dir $@)
	zip -9 --filesync --move --recurse-paths $@ nodejs/

.DEFAULT_GOAL := chrome_aws_lambda.zip
