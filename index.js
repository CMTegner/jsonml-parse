var Parser = require('htmlparser2').Parser;

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
            // Delete elementList if it is empty
            var lastChild = p[p.length - 1];
            if (lastChild[2].length === 0) {
                delete lastChild[2];
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
