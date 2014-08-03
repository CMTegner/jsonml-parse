#!/usr/bin/env node
var fs = require('fs');
var parse = require('../');
var args = require('nomnom')
    .option('output', {
        abbr: 'o',
        help: 'Output file, will send to stdout if not specified'
    })
    .option('file', {
        position: 0,
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

var input;
if (!args.file) {
    input = process.stdin;
    process.on('SIGINT', function() {
        // Allow the user to write markup manually
        // to stdin and end with Ctrl+C
        parser.end();
        process.exit(0);
    });
} else {
    input = fs.createReadStream(args.file, 'utf8')
        .on('error', function (err) {
            if (err.code === 'ENOENT') {
                console.error('No such file: %s', args.file);
                process.exit(1);
                return;
            }
            throw err;
        });
}

var parser = parse();
input
    .pipe(parser)
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
