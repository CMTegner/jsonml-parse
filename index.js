var Parser = require('htmlparser2').Parser;
var isEmpty = require('lodash.isempty');

module.exports = function() {
    var parent = [];
    var parser = new Parser({
        onopentag: function(tagName, attributes) {
            var elementList = [];
            var element = [tagName, attributes, elementList];
            parent.push(element);
            elementList.parent = parent;
            parent = elementList;
        },
        ontext: function(text) {
            parent.push(['#text', text]);
        },
        onclosetag: function() {
            var p = parent.parent;
            // Delete elementList and/or attributes if empty
            var lastChild = p[p.length - 1];
            for (var i = 1; i < 3; i++) {
                if (isEmpty(lastChild[i])) {
                    delete lastChild[i];
                }
            }
            delete parent.parent;
            parent = p;
        },
        onend: function() {
            parser.emit('data', parent);
        }
    });
    return parser;
};
