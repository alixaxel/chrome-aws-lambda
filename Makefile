.PHONY: clean

clean:
	rm -f $(lastword $(MAKECMDGOALS))

.fonts.zip:
	zip -9 --filesync --move --recurse-paths .fonts.zip .fonts/

%.zip:
	npm install --no-fund --no-package-lock --no-shrinkwrap --only=dev
	mkdir -p nodejs/
	npm install --prefix nodejs/ lambdafs@~2.0.3 puppeteer-core@~8.0.1 --no-bin-links --no-fund --no-optional --no-package-lock --no-save --no-shrinkwrap
	npm pack
	mkdir -p nodejs/node_modules/chrome-aws-lambda/
	tar --directory nodejs/node_modules/chrome-aws-lambda/ --extract --file chrome-aws-lambda-*.tgz --strip-components=1
	rm chrome-aws-lambda-*.tgz
	mkdir -p $(dir $@)
	zip -9 --filesync --move --recurse-paths $@ nodejs/

.DEFAULT_GOAL := chrome_aws_lambda.zip
