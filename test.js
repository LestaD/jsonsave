var json = require('./jsonsave');
var __c = require('conlog')('jsonsave');

var _file = __dirname + '/thetest.json';
var _sec = __dirname + '/secondtest.json';


"create from file".log();
var f1 = json.new(_file);
console.log("original: ", f1);
f1.loader = 1;
f1.version++;
f1.$$save;
console.log('aftersave: ', f1);
" ".gray.li();


"create from object".log();
var f2 = json.new({ name: "John", last: "Snow" });
console.log("new: ", f2);
try {
  f2.$$save;
}
catch (e) {
  "Save without file catched".log();
  f2.$$merge = {
    veryverylongvalue: 10921
  };
  console.log("what save as: ", f2);
  f2.$$saveAs = __dirname + '/spectest.json';
}

" ".gray.li();


"create clean object".log();
var c1 = json.clean.new(_sec);
console.log("return: ", c1);
c1.s = c1.s ? ++c1.s : 1;
json.merge(c1, {
  obj: {
    sub: c1.obj.sub + 1,
    subsub: {
      mustreplace: "Allright"
    },
    overnewvalue: Math.random()
  },
  whathwahtawh: 'What'.toString()
});
json.saveAs(c1, __dirname+'/secspec.json');
if ( typeof c1.$$save === "undefined" ) {
  "Object really clean".log();
}
" ".gray.li();


"catch undefined type".log();
try {
  var t1 = json.new(1);
}
catch(e) {
  "catched: %s".info(e.message);
}
"".gray.li();