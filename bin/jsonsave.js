var FS = require('fs');

var Json = {};

// Links
var clean = Symbol('clean');
var file = Symbol('file');
var make = Symbol('make');

Json[clean] = false;

Json.new = function(fo) {
  var ob = null;

  if (typeof fo === "string") {
    ob = Json[make]({});
    ob[file] = fo;
    Json.load(ob);
  }
  else if (fo instanceof Array) {
    throw new Error('Can not create object from array');
  }
  else if (typeof fo === "object") {
    // create object from fo
    ob = Json[make](fo);
  }
  else if (typeof fo === "undefined") {
    // create empty
    ob = Json[make]({});
  }
  else {
    throw new Error('Undefined type ' + typeof fo);
  }

  Json[clean] = false;
  return ob;
};

/**
 * Create nude object from base object
 * If Json[clean] == false
 *     Add custom methods
 *
 * @param  {Object} o
 * @return {NudeObject} generated object
 */
Json[make] = function(o) {
  var s = Object.create(null);
  for (var key in o) {
    s[key] = o[key];
  }

  if (Json[clean] == false) {
    Json_assign(s);
  }

  return s;
};

/**
 * Set symb for clean create object
 *
 */
Object.defineProperty(Json, 'clean', {
  __proto__: null,
  get: function(){
    Json[clean] = true;
    return Json;
  }
});

/**
 * Try save file to
 * @param  {NudeObject} object
 * @param  {String} file
 */
Json.save = function(object) {
  var f = object[file];
  if (f) {
    FS.writeFileSync(f, JSON.stringify(object, 0, 2), {encoding: 'utf8'});
  }
  else {
    throw new Error('Object is new. Please use saveAs$$ = "/path.json"');
  }
};

/**
 *
 * @param  {NudeObject} object
 * @param  {string} file
 */
Json.saveAs = function(object, file) {
  if (typeof file !== "string") {
    throw new Error('Error type');
  }
  FS.writeFileSync(file, JSON.stringify(object, 0, 2), {encoding: 'utf8'});
}


/**
 * Add values from second to object
 * @param  {NudeObject} object
 * @param  {Object} second
 * @param  {Boolean} addonly Only add unexisted
 */
Json.merge = function(object, second, addonly) {
  for (var key in second) {
    if (typeof object[key] !== "undefined" && !addonly) {
      // Key exists and overwrite
      if (typeof object[key] === "object" && typeof second[key] === "object") {
        object[key] = Json.merge(object[key], second[key], addonly);
      }
      else {
        if (typeof second[key] !== "undefined") {
          // object and second not object, overwrite it
          object[key] = second[key];
        }
      }
    }
    else if (typeof object[key] !== "undefined" && addonly) {
      // not do
    }
    else {
      object[key] = second[key];
    }
  }
  return object;
}


/**
 * Load data from file and set inside
 *
 * @param {NudeObject} object
 * @param {Boolean} merge  If true merge with exists
 *                         If false replace
 */
Json.load = function(object, merge) {
  var content = FS.readFileSync(object[file], {encoding: 'utf8', flag: 'r'});
  if (content) {
    try {
      var newobject = JSON.parse(content);
      if (merge) {
        Json.merge(object, merge, true);
      }
      else {
        // simple set keys
        for (var key in newobject) {
          object[key] = newobject[key];
        }
      }
    }
    catch (e) {
      throw new Error('Not valid JSON');
    }
  }
}


// Create new methods
function Json_assign(object) {
  // Save
  Object.defineProperty(object, '$$save', {
    enumerable: false,
    get: function() {
      Json.save(this);
      return this;
    }
  });

  Object.defineProperty(object, '$$saveAs', {
    enumerable: false,
    set: function(v) {
      Json.saveAs(this, v);
      return this;
    }
  });

  Object.defineProperty(object, '$$merge', {
    enumerable: false,
    set: function(obj) {
      Json.merge(this, obj);
      return this;
    }
  });

  Object.defineProperty(object, '$$insert', {
    enumerable: false,
    set: function(obj) {
      Json.merge(this, obj, true);
      return this;
    }
  });


}




module.exports = (function() {
  return Json;
})();
