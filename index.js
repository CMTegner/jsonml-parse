var util = require('util');
var Transform = require('stream').Transform;
var Parser = require('htmlparser2').Parser;
var isEmpty = require('lodash.isempty');
var decode = (new (require('html-entities').AllHtmlEntities)()).decode;

util.inherits(JSONMLParser, Transform);

function JSONMLParser() {
    Transform.call(this);
    this._readableState.objectMode = true;
    this.source = new Parser(this._createSourceOptions());
}

JSONMLParser.prototype._transform = function(chunk, encoding, done) {
    this.source.write(chunk, encoding);
    done();
};

JSONMLParser.prototype._flush = function(done) {
    this._onParseDone = done;
    this.source.end();
};

JSONMLParser.prototype._createSourceOptions = function() {
    var transform = this;
    var parent;
    return {
        onopentag: function(tagName, attributes) {
            var element = [tagName];
            if (!isEmpty(attributes)) {
                element.push(attributes);
            }
            if (parent) {
                parent.push(element);
                element.parent = parent;
            }
            parent = element;
        },
        ontext: function(text) {
            (parent || transform).push(decode(text));
        },
        oncomment: function(text) {
            (parent || transform).push(['#comment', text]);
        },
        onclosetag: function() {
            var p = parent.parent;
            delete parent.parent;
            if (!p) {
                transform.push(parent);
            }
            parent = p;
        },
        onerror: function(err) {
            transform.emit('error', err);
        },
        onend: function() {
            transform._onParseDone();
        }
    };
};

module.exports = function(markup, callback) {
    var parser = new JSONMLParser();
    if (isEmpty(arguments)) {
        return parser;
    } else {
        var result = [];
        parser.on('data', function(data) {
            result.push(data);
        });
        parser.on('end', function() {
            if (result.length < 2) {
                result = result[0];
            }
            callback(null, result);
        });
        parser.on('error', callback);
        parser.end(markup);
    }
};
