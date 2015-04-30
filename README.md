# README

 [![NPM](https://nodei.co/npm/jsonsave.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/jsonsave/)

## Using
You can open `.json` file, edit and save with simple methods

```javascript
var json = require('jsonsave');

var manifest = new json.File(__dirname + '/manifest.json');
manifest.$.version = ++manifest.$.version;
manifest.save();
```

Enjoy!


## Options

```javascript
var f = new json.File('file.json', {
  create: true, // if not exists
  overwrite: true, // if exists
  encoding: 'utf8',
  read: true, // read file after create object
  pretty: true // save file pretty and indented
});

f.read() // for reading file to .$ variable
```
