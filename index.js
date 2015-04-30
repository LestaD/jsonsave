var fs = require('fs');


function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

var _defaults = {
	create: true,
	overwrite: true,
	encoding: 'utf8',
	read: true,
	pretty: true
};

function JsonFile(file, opts) {
	if (!opts) opts = {};
	this.options = merge_options(opts, _defaults);
	this.file = file;
	if (this.options.read) this.read();
};

JsonFile.prototype.$ = null;

JsonFile.prototype.read = function(){
	if (!fs.existsSync(this.file)) {
		if (this.options.create) {
			this.$ = {};
			return true;
		}
		else return false;
	}

	var tmp = fs.readFileSync(this.file, {encoding: this.options.encoding});
	this.$ = JSON.parse(tmp);
};



JsonFile.prototype.save = function() {
	if (fs.existsSync(this.file) && !this.options.overwrite) {
		return false;
	}
	var tmp = this.options.pretty ? JSON.stringify(this.$, 0, 2) : JSON.stringify(this.$);
	return fs.writeFileSync(this.file, tmp, {encoding: this.options.encoding});
};


module.exports.File = JsonFile;