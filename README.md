#jsonml-parse

Convert markup (HTML) in text form to [JSONML](http://jsonml.org).

[![Travis CI Build Status](https://travis-ci.org/CMTegner/jsonml-parse.svg)](http://travis-ci.org/CMTegner/jsonml-parse) [![Dependency Status](https://david-dm.org/CMTegner/jsonml-parse/status.svg)](https://david-dm.org/CMTegner/jsonml-parse)

[![NPM Module](https://nodei.co/npm/jsonml-parse.png)](http://npm.im/jsonml-parse)

[![Browser support](https://ci.testling.com/CMTegner/jsonml-parse.png)](https://ci.testling.com/CMTegner/jsonml-parse)

##Example

```js
var parse = require('jsonml-parse');
parse('<button class="btn">Awesome</button>', function(err, data) {
    console.dir(data);
    //-> ["button", { "class": "btn" }, "Awesome"]
});
```

## Install

With [npm](http://npmjs.org) do:
```bash
npm install jsonml-parse
```

`jsonml-parse` also works in the browser, both via [browserify](http://browserify.org) and as a [stand-alone script](http://wzrd.in/standalone/jsonml-parse@latest):

```html
<script src="http://wzrd.in/standalone/jsonml-parse@latest"></script>
```

## Usage

```javascript
var parse = require('jsonml-parse');
```

`jsonml-parse` exposed two different API styles: callback and stream.

### parse(markup, callback)

Parses the `markup` string and invokes `callback` when done. `callback` is treated as a node-style callback, i.e. the first argument will always be the error object (`null` on success), and the second will always be the JSONML result. *Note:* If `markup` contains multiple top-level nodes they will be wrapped in an array before being passed to `callback`.

### var stream = parse()

Returns a new [transform stream](http://nodejs.org/api/stream.html#stream_class_stream_transform) which you will write the markup to, and read the JSONML from. *Note:* Each top-level node will be emitted as separate 'data' events.

## CLI

`jsonml-parse` also comes with a CLI tool (`jsonmlparse`):

```bash
$ jsonmlparse --help

Usage: node jsonmlparse [file] [options]

file     The file containing the markup to convert to JSONML, will read from stdin if not specified

Options:
   -o, --output   Output file, will send to stdout if not specified
   --version      Print version and exit
```

Example:

```bash
curl www.bbc.co.uk | jsonmlparse > bbc.json
```