var fs = require('fs');
var test = require('tape');
var jsonmlify = require('../../');

test('should not set a node-list array on the node if it has no children', function(t) {
    fs.createReadStream(__dirname + '/markup.html')
        .pipe(jsonmlify())
        .on('data', function(data) {
            t.deepEqual(data, require('./expected.json'));
            t.end();
        })
        .on('error', function(err) {
            t.fail(err);
        });
});
