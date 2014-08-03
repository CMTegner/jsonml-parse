var fs = require('fs');
var test = require('tape');
var jsonmlify = require('../');

function verify(testDir, t) {
    fs.createReadStream(__dirname + '/' + testDir + '/markup.html')
        .pipe(jsonmlify())
        .on('data', function(data) {
            t.deepEqual(data, require('./' + testDir + '/expected.json'));
            t.end();
        })
        .on('error', function(err) {
            t.fail(err);
        });
}

test('should return an empty array for empty input markup', function(t) {
    verify('01-empty', t);
});

test('should not set a node-list array on the node if it has no children', function(t) {
    verify('02-single-shallow-tag', t);
});