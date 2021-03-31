#/bin/bash

set -e

LOG_FILE="log.txt"

echo "Running Puppeteer lambda function"
docker run --rm -v "$PWD":/var/task:ro,delegated lambci/lambda:nodejs12.x buildbots/puppeteer.handler '{"url": "https://example.com"}' &> "$LOG_FILE"
grep -Fq "Example Domain" "$LOG_FILE"
echo "Sucessfully passed Puppeteer test"

rm "$LOG_FILE"
