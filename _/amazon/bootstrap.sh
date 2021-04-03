#/usr/bin/env bash

# docker run --rm -v "$PWD":/var/task:ro,delegated lambci/lambda:nodejs12.x _/actions/puppeteer.handler '{"url": "https://example.com"}' 2>&1 | grep -Fq "Example Domain" && \
# (echo 'Test Passed' && exit 0) || (echo 'Test Failed' && exit 1)

# sam local invoke --template ./puppetter/template.yml --event ./puppetter/events/example.com.json node10 2>&1 | (grep -iq Error && exit 1 || exit 0)
# sam local invoke --template ./puppetter/template.yml --event ./puppetter/events/example.com.json node12 2>&1 | (grep -iq Error && exit 1 || exit 0)
# sam local invoke --template ./puppetter/template.yml --event ./puppetter/events/example.com.json node14 2>&1 | (grep -iq Error && exit 1 || exit 0)
sam local invoke --template ./puppetter/template.yml --event ./puppetter/events/example.com.json node10
sam local invoke --template ./puppetter/template.yml --event ./puppetter/events/example.com.json node12
sam local invoke --template ./puppetter/template.yml --event ./puppetter/events/example.com.json node14
