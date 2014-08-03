var Parser = require('htmlparser2').Parser;

module.exports = function() {
    var parent = [];
    var parser = new Parser({
        onopentag: function(tagName, attributes) {
            var elementList = [];
            parent.push([tagName, attributes, elementList]);
            elementList.parent = parent;
            parent = elementList;
        },
        ontext: function(text) {
            parent.push(['#text', text]);
        },
        onclosetag: function() {
            var p = parent.parent;
            delete parent.parent;
            parent = p;
        },
        onend: function() {
            parser.emit('data', parent);
        }
    });
    return parser;
};
