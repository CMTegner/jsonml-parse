#!/usr/bin/env node
var fs = require('fs');
var jsonmlify = require('../');
var args = require('nomnom')
    .option('output', {
        abbr: 'o',
        help: 'Output file, will send to stdout if not specified'
    })
    .option('file', {
        position: 0,
        required: true,
        help: 'The file containing the markup to convert to JSONML'
    })
    .option('version', {
        flag: true,
        help: 'Print version and exit',
        callback: function() {
            return require('../package.json').version;
        }
    })
    .parse();

fs.createReadStream(args.file, 'utf8')
    .on('error', function (err) {
        if (err.code === 'ENOENT') {
            console.error('No such file: %s', args.file);
            process.exit(1);
            return;
        }
        throw err;
    })
    .pipe(jsonmlify())
    .on('data', function(data) {
        var str = JSON.stringify(data);
        if (args.output) {
            fs.createWriteStream(args.output)
                .on('error', function(err) {
                    throw err;
                })
                .end(str, 'utf8');
        } else {
            process.stdout.write(str);
        }
    })
    .on('end', function () {
        if (!process.stdout.isTTY) {
            // Prevent noise if the command you're
            // piping the output to fails
            process.exit(0);
        }
    })
    .on('error', function (err) {
        throw err;
    });
