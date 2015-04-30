var json = require('./');
var __c = require('conlog')('jsonsave');

var _file = __dirname + '/thetest.json';

"Load file %s".log(_file);

var file = new json.File(_file);
file.$.version = file.$.version ? ++file.$.version : 1;
"Version: %s".log(file.$.version);
file.save();

"Finish testing".log();