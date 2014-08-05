var util = require('util');
var Transform = require('stream').Transform;
var Parser = require('htmlparser2').Parser;
var isEmpty = require('lodash.isempty');

util.inherits(JSONMLParser, Transform);

function JSONMLParser() {
    Transform.call(this);
    this._readableState.objectMode = true;
    this._parent = [];
    this.source = new Parser(this._createSourceOptions());
}

JSONMLParser.prototype._transform = function(chunk, encoding, done) {
    this.source.write(chunk, encoding);
    done();
};

JSONMLParser.prototype._flush = function(done) {
    this._onParseDone = done;
    this.source.end();
    done();
};

JSONMLParser.prototype._createSourceOptions = function() {
    var transform = this;
    return {
        onopentag: function(tagName, attributes) {
            var element = [tagName];
            if (!isEmpty(attributes)) {
                element.push(attributes);
            }
            transform._parent.push(element);
            element.parent = transform._parent;
            transform._parent = element;
        },
        ontext: function(text) {
            transform._parent.push(text);
        },
        oncomment: function(text) {
            transform._parent.push(['#comment', text]);
        },
        onclosetag: function() {
            var parent = transform._parent.parent;
            delete transform._parent.parent;
            transform._parent = parent;
        },
        onerror: function(err) {
            transform.emit('error', err);
        },
        onend: function() {
            transform.push(transform._parent);
            transform._onParseDone();
        }
    };
};

module.exports = function(markup, callback) {
    var parser = new JSONMLParser();
    if (isEmpty(arguments)) {
        return parser;
    } else {
        parser.on('data', function(data) {
            callback(null, data);
        });
        parser.on('error', callback);
        parser.end(markup);
    }
};
