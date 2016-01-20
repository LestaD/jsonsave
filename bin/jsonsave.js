var FS = require('fs');

var Json = {};

// Links
var clean = Symbol('clean');
var file = Symbol('file');
var make = Symbol('make');

Json[clean] = false;

Json.new = function(file_object) {
  var res_obj = null;

  if (typeof file_object === "string") {
    res_obj = Json[make]({});
    res_obj[file] = file_object;
    Json.load(res_obj);
  }
  else if (file_object instanceof Array) {
    throw new Error('Can not create object from array');
  }
  else if (typeof file_object === "object") {
    // create object from file_object
    res_obj = Json[make](file_object);
  }
  else if (typeof file_object === "undefined") {
    // create empty
    res_obj = Json[make]({});
  }
  else {
    throw new Error('Undefined type ' + typeof file_object);
  }

  Json[clean] = false;
  return res_obj;
};

/**
 * Create nude object from base object
 * If Json[clean] === false
 *     Add custom methods
 *
 * @param  {Object} obj
 * @return {NudeObject} generated object
 */
Json[make] = function(obj) {
  var res = Object.create(null);
  for (var key in obj) {
    res[key] = obj[key];
  }

  if (Json[clean] === false) {
    assign_json(res);
  }

  return res;
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
};


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
};


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
};


// Create new methods
function assign_json(object) {
  // Save
  Object.defineProperty(object, '$$save', {
    enumerable: false,
    get: function() {
      var that = this;
      return function() {
        return Json.save(that);
      };
    }
  });

  Object.defineProperty(object, '$$saveAs', {
    enumerable: false,
    get: function() {
      var that = this;
      return function(another){
        return Json.saveAs(that, another);
      };
    }
  });

  Object.defineProperty(object, '$$merge', {
    enumerable: false,
    get: function() {
      var that = this;
      return function(newobject) {
        return Json.merge(that, newobject);
      };
    }
  });

  Object.defineProperty(object, '$$insert', {
    enumerable: false,
    get: function() {
      var that = this;
      return function(newobject) {
        return Json.merge(that, newobject, true);
      };
    }
  });
}


module.exports = (function() {
  return Json;
})();
