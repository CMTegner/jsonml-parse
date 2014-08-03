#!/bin/sh -e
echo "Testing cli..."
base=$(dirname $0)
node ${base}/../bin/cli.js ${base}/cli/markup.html | diff -q ${base}/cli/expected.json -
node ${base}/../bin/cli.js ${base}/cli/markup.html -o ${base}/cli/tmp.json
diff -q ${base}/cli/expected.json ${base}/cli/tmp.json
rm ${base}/cli/tmp.json
