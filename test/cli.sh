#!/bin/sh -e
echo "Testing cli..."
base=$(dirname $0)
cat ${base}/cli/markup.html | node ${base}/../bin/cli.js | diff -q ${base}/cli/expected.json -
node ${base}/../bin/cli.js ${base}/cli/markup.html | diff -q ${base}/cli/expected.json -
node ${base}/../bin/cli.js ${base}/cli/markup.html -o ${base}/cli/tmp.json
diff -q ${base}/cli/expected.json ${base}/cli/tmp.json
rm ${base}/cli/tmp.json
set +e
error=$(node ${base}/../bin/cli.js nope 2>&1)
test $? -eq 1
[ "$error" = "No such file: nope" ] || (echo "'No such file' logic is broken!"; exit 1)
error=$(node ${base}/../bin/cli.js ${base}/cli/markup.html -o /nope/nope/nope 2>&1)
test $? -eq 1
[ "$error" = "No such directory: /nope/nope" ] || (echo "'No such output directory' logic is broken!"; exit 1)