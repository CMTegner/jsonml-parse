#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var parse = require('../');
var stringify = require('JSONStream').stringify;
var args = require('nomnom')
    .option('output', {
        abbr: 'o',
        help: 'Output file, will send to stdout if not specified'
    })
    .option('file', {
        position: 0,
        help: 'The file containing the markup to convert to JSONML, will read from stdin if not specified'
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

var output;
if (args.output) {
    output = fs.createWriteStream(args.output)
        .on('error', function(err) {
            if (err.code === 'ENOENT') {
                var dir = path.dirname(args.output);
                console.error('No such directory: %s', dir);
                process.exit(1);
                return;
            }
            throw err;
        });
} else {
    output = process.stdout
        .on('error', function (err) {
            if (process.stdout.isTTY) {
                // Only throw output errors if we're in
                // a TTY to prevent noise when piping
                // the output to other commands
                throw err;
            }
        });
}

var parser = parse();
input
    .pipe(parser)
    .pipe(stringify(false))
    .pipe(output);
