var fs = require('fs');
var test = require('tape');
var jsonmlify = require('../../');

test('should return an empty array for empty input markup', function(t) {
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
