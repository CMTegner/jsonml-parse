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

test('should not set a attribute hash on the node if it has none', function(t) {
    verify('03-no-attributes', t);
});

test('should parse nested tags and text nodes', function(t) {
    verify('04-nested-tags', t);
});

test('should parse comments', function(t) {
    verify('05-comments', t);
});

test('should report errors', function(t) {
    var stream = jsonmlify();
    stream.on('error', function(err) {
        t.ok(err);
        t.end();
    });
    stream.end();
    stream.write('<div></div>'); // Write after close to provoke an error
});