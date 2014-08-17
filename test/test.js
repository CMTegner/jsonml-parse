var test = require('tape');
var Transform = require('stream').Transform;
var parse = require('../');

function verify(markup, expected, t) {
    var result = [];
    parse()
        .on('data', function(data) {
            result.push(data);
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

test('should not emit anything for empty input markup', function(t) {
    verify('', [], t);
});

test('should not set a node-list array on the node if it has no children', function(t) {
    var markup = '<button class="btn"></button>';
    var expected = [['button', { 'class': 'btn' }]];
    verify(markup, expected, t);
});

test('should not set a attribute hash on the node if it has none', function(t) {
    var markup = '<div></div>';
    var expected = [['div']];
    verify(markup, expected, t);
});

test('should parse nested tags and text nodes', function(t) {
    var markup =
        '<ul>\n' +
        '    <li>One</li>\n' +
        '    <li class="selected">Two</li>\n' +
        '    <li>Three</li>\n' +
        '</ul>';
    var expected = [['ul',
        '\n    ',
        ['li', 'One'],
        '\n    ',
        ['li', { 'class': 'selected' }, 'Two'],
        '\n    ',
        ['li', 'Three'],
        '\n'
    ]];
    verify(markup, expected, t);
});

test('should parse comments', function(t) {
    var markup =
        '<!-- this is a comment -->\n' +
        'Not a comment\n' +
        '<!-- another comment -->';
    var expected = [
        ['#comment', ' this is a comment '],
        '\nNot a comment\n',
        ['#comment', ' another comment ']
    ];
    verify(markup, expected, t);
});

test('should convert HTML entities into unicode characters', function(t) {
    var markup =
        '<button class="close">&times;</button>\n' +
        '&laquo;Yeah, ok&raquo;\n' +
        '&aelig;&oslash;&aring;\n' +
        '&copy; Awesome Inc.';
    var expected = [
        ['button', { 'class': 'close' }, '×'],
        '\n«Yeah, ok»\næøå\n© Awesome Inc.'
    ];
    verify(markup, expected, t);
});

test('should also offer a node-style callback API', function(t) {
    parse('<div></div>', function(err, result) {
        t.notOk(err);
        t.deepEqual(result, ['div']);
        parse('<b></b><i><u></u></i>', function(err, result) {
            t.notOk(err);
            t.deepEqual(result, [['b'], ['i', ['u']]]);
            parse('', function(err, result) {
                t.notOk(err);
                t.equal(result, undefined);
                t.end();
            });
        });
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
