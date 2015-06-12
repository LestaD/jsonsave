var json = process.env.COVERAGE
           ? require('../coverage/jsonsave.js')
           : require('../bin/jsonsave.js');

var should = require('should');
var fs = require('fs');

describe('jsonsave', function(){

  it('should be have new()', function(){
    json.should.have.property('new');
    should(json.new).be.a.Function;
  });

  it('should be have clean', function(){
    json.should.have.property('clean');
    should(json.clean).be.a.Object;
  });

  it('should be have clean.new()', function(){
    json.clean.should.be.have.property('new');
    should(json.clean.new).be.a.Function;
  });

  it('should be have save()', function(){
    json.should.be.have.property('save');
    json.save.should.be.a.Function;
  });

  it('should be have saveAs()', function(){
    json.should.be.have.property('saveAs');
    json.save.should.be.a.Function;
  });

  it('should be have merge()', function(){
    json.should.be.have.property('merge');
    json.save.should.be.a.Function;
  });

  it('should be have load()', function(){
    json.should.be.have.property('load');
    json.save.should.be.a.Function;
  });


  describe('.new()', function(){
    it('create empty object', function(){
      Object.keys(json.new()).length.should.equal(0);
    });

    it('create object from {a: 1, b: "string", c: [], d: {}}', function(){
      var created = json.new({a: 1, b: "string", c: [], d: {}});
      should(created).have.property('a', 1);
      should(created).have.property('b', "string");
      should(created).have.property('c', []);
      should(created.c.length).equal(0);
      should(created).have.property('d', {});
      should(Object.keys(created.d).length).equal(0);
    });

    describe('in created object', function(){
      it('should have $$save', function(){
        var js = json.new(__dirname + '/test1.json');
        should(js).have.property('$$save');
      });

      it('should have $$saveAs', function(){
        var js = json.new(__dirname + '/test1.json');
        should(js).have.property('$$saveAs');
      });

      it('should have $$merge', function(){
        var js = json.new(__dirname + '/test1.json');
        should(js).have.property('$$merge');
      });

      it('should have $$insert', function(){
        var js = json.new(__dirname + '/test1.json');
        should(js).have.property('$$insert');
      });

      it('should methods with $$ not enumerable', function(){
        var js = json.new(__dirname + '/test1.json');

        should(js).have.property('$$save').not.be.a.Function;
        should(js).have.property('$$saveAs').not.be.a.Function;
        should(js).have.property('$$merge').not.be.a.Function;
        should(js).have.property('$$insert').not.be.a.Function;

        should(js['$$save']).be.empty;
        should(js['$$saveAs']).be.empty;
        should(js['$$merge']).be.empty;
        should(js['$$insert']).be.empty;
      });
    });
    
    var object = {id: 12, name: "John Snow", "second name": "Stark", "childs": ["first", "second"], "weapon": {name: "Knife"}};
    it('should create object '+JSON.stringify(object), function(){
      var js = json.new(object);

      should(js).not.empty;
      should(Object.keys(js).length).equal(Object.keys(object).length);

      should(js).have.property('id', object['id']);
      should(js).have.property('name', object['name']);
      should(js).have.property('second name', object['second name']);

      should(js).have.property('childs').with.lengthOf(object['childs'].length);
      should(js.childs[0]).equal(object.childs[0]);
      should(js.childs[1]).equal(object.childs[1]);

      should(js).have.property('weapon');
      should(js.weapon).have.property('name', object.weapon.name);
    });

    it('drop create object from number', function(){
      should(function(){
        json.new(1);
      }).throw('Undefined type number')
    });

    it('drop create object from array', function(){
      should(function(){
        json.new([12,12]);
      }).throw('Can not create object from array')
    });

    it('drop create object from Boolean', function(){
      should(function(){
        json.new(true);
      }).throw('Undefined type boolean');

      should(function(){
        json.new(false);
      }).throw('Undefined type boolean');
    });

    it('drop create object from Function', function(){
      should(function(){
        json.new(function(){});
      }).throw('Undefined type function');
    });
  });



});