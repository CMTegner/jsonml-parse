var fs = require('fs');
var test = require('tape');
var Transform = require('stream').Transform;
var parse = require('../');

function verify(markup, expected, t) {
    var result;
    parse()
        .on('data', function(data) {
            result = data;
        })
        .on('end', function() {
            t.deepEqual(result, expected);
            t.end();
        })
        .end(markup);
}

test('should return a transform stream', function(t) {
    t.ok(parse() instanceof Transform);
    t.ok(new parse() instanceof Transform);
    t.end();
});

test('should not return anything in \'callback mode\'', function(t) {
    t.equal(parse('foo', function() {}), undefined);
    t.end();
});

test('should emit an empty array for empty input markup', function(t) {
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

test('should also offer a node-style callback API', function(t) {
    parse('<div></div>', function(err, result) {
        t.notOk(err);
        t.deepEqual(result, [['div']]);
        t.end();
    });
});

test('should report errors', function(t) {
    var errorCount = 0;
    var stream = parse();
    stream.on('error', function(err) {
        errorCount++;
        t.ok(err);
        if (errorCount === 2) {
            t.end();
        }
    });
    stream.end();
    // Write after end to provoke an error in the writable stream
    stream.write('<div></div>');
    // Write to HTML parser after end to provoke an internal error
    stream.source.write('<div></div>');
});
