var json = require('./');
var __c = require('conlog')('jsonsave');

var _file = __dirname + '/thetest.json';
var _sec = __dirname + '/secondtest.json';

"Load file %s".log(_file);

var file = new json.File(_file);
file.$.version = file.$.version ? ++file.$.version : 1;
"Version: %s".log(file.$.version);
file.save();

"Saving as %s".log(_sec);
file.saveAs(_sec);

"Finish testing".log();