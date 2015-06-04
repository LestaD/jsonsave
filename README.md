# README

 [![NPM](https://nodei.co/npm/jsonsave.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/jsonsave/)

## Usage
You can open `.json` file, edit and save with simple methods

```javascript
var json = require('jsonsave');

var manifest = json.new(__dirname + '/manifest.json');
manifest.version = ++manifest.version;
manifest.$$save;
```


## Save as

```javascript
var file = json.new('/path/to/file.json');

file.$$merge = { name: "John", last: "Snow" };
file.$$saveAs = '/another/path/to/file.json';
```

## Insert and merge
```javascript
var bastard = json.new({name: "Jon"});

bastard.$$merge = {name: John}; // now bastard.name === "John"
bastard.$$insert = {last: "Snow", name: "WOW"}; // now {name: "John", last: "Snow"};

bastard.$$saveAs = "/game_of_thrones/westeros/north/stark/bastard.json";
```

## Clean objects

In clean mode magic `$$` variables does not creating.
Use `json.save()`, `json.merge()`, `json.saveAs()`, `json.insert()`.

```javascript
var ob = json.clean.new(); // or json.clean.new({}) or json.clean.new('path/to.json');
ob.name = "ob";
ob.description = "ob pro comfort";
ob.version = "10.0.8";

typeof ob.$$saveAs === "undefined"; // true
json.saveAs(ob, __dirname + '/tmp/whatthe.json');
```

