var fs = require('fs');
var test = require('tape');
var jsonmlify = require('../');

function verify(markup, expected, t) {
    jsonmlify()
        .on('data', function(data) {
            t.deepEqual(data, expected);
            t.end();
        })
        .end(markup);
}

test('should return an empty array for empty input markup', function(t) {
    var markup = fs.readFileSync(__dirname + '/01-empty/markup.html', 'utf8');
    var expected = require('./01-empty/expected.json');
    verify(markup, expected, t);
});

test('should not set a node-list array on the node if it has no children', function(t) {
    var markup = fs.readFileSync(__dirname + '/02-single-shallow-tag/markup.html', 'utf8');
    var expected = require('./02-single-shallow-tag/expected.json');
    verify(markup, expected, t);
});

test('should not set a attribute hash on the node if it has none', function(t) {
    var markup = fs.readFileSync(__dirname + '/03-no-attributes/markup.html', 'utf8');
    var expected = require('./03-no-attributes/expected.json');
    verify(markup, expected, t);
});

test('should parse nested tags and text nodes', function(t) {
    var markup = fs.readFileSync(__dirname + '/04-nested-tags/markup.html', 'utf8');
    var expected = require('./04-nested-tags/expected.json');
    verify(markup, expected, t);
});

test('should parse comments', function(t) {
    var markup = fs.readFileSync(__dirname + '/05-comments/markup.html', 'utf8');
    var expected = require('./05-comments/expected.json');
    verify(markup, expected, t);
});

test('should also expose a node-style callback API', function(t) {
    jsonmlify('<div></div>', function(err, result) {
        t.notOk(err);
        t.deepEqual(result, [['div']]);
        t.end();
    });
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