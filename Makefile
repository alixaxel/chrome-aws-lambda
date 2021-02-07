.PHONY: clean

clean:
	rm -f $(lastword $(MAKECMDGOALS))

.fonts.zip:
	zip -9 --filesync --move --recurse-paths .fonts.zip .fonts/

%.zip:
	mkdir -p nodejs/node_modules/chrome-aws-lambda/
	cd nodejs/ && npm install lambdafs@~2.0.2 puppeteer-core@~6.0.0 --no-bin-links --no-optional --no-package-lock --no-save --no-shrinkwrap && cd -
	npm pack
	tar --directory nodejs/node_modules/chrome-aws-lambda/ --extract --file chrome-aws-lambda-*.tgz --strip-components=1
	rm chrome-aws-lambda-*.tgz
	mkdir -p $(dir $@)
	zip -9 --filesync --move --recurse-paths $@ nodejs/

.DEFAULT_GOAL := chrome_aws_lambda.zip
