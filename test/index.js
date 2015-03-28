'use strict';

var test = require('tape');
var trickbag = require('../index.js');

test('Lack of params', function(assert) {
    assert.plan(3);

    try {
        trickbag();
    }
    catch(e) {
        assert.pass('No param throws an error.');
    }

    try {
        trickbag("some");
    }
    catch(e) {
        assert.pass('1 param throws an error.');
    }

    try {
        trickbag({}, undefined);
    }
    catch(e) {
        assert.pass('Undefined mixins should fail.');
    }
});

test('Single mixin', function(assert) {
    assert.plan(3);

    var mixin = {
        init: function() {
            assert.pass('The mixin has been called.');
        },

        remove: function() {
            assert.pass('The mixin method without stack has been called.');
        }
    };

    var model = {
        init: function() {
            assert.pass('Original method has been called.');
        }
    };

    trickbag(model, mixin);
    model.init();
    model.remove();
});

test('Stack mixins', function(assert) {
    assert.plan(2);

    var mixin = {
        init: function() {
            this.foo = 'hoy';
            assert.equal(this.foo, 'hoy', 'mixin.init is called second & modifie model property.');
        }
    };

    var model = {
        foo: 'bar',
        init: function() {
            assert.equal(this.foo, 'bar', 'model.init is called first.');
        }
    };

    trickbag(model, mixin);
    model.init();
});