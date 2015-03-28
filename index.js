'use strict';

var toString = Object.prototype.toString;
var slice = Array.prototype.slice;

module.exports = function applyMixins(object, mixins) {
    if (!object) throw new Error('Trickbag need a to be passed an object to apply mixins on.');
    if (!mixins) throw new Error('Trickbag need a to be passed mixins.');
    if (toString.call(mixins).toLowerCase() === '[object object]') mixins = [mixins];

    var stack = Object.create(null);

    for (var i = 0; i < mixins.length; i++) {
        var mixin = mixins[i];

        for (var prop in mixin) {
            var fn = mixin[prop];
            if (!isFunction(fn)) continue;

            if (object[prop]) {
                if (object[prop] === fn) continue;

                stack[prop] = stack[prop] || [];
                stack[prop].push(fn);
            }
            else {
                object[prop] = fn;
            }
        }
    }

    // Wrap all stack in a function that preserves order & parameters.
    // Allows to have different mixins using the same method names.
    for (prop in stack) {
        var orig = object[prop];
        var fns = stack[prop];

        object[prop] = function() {
            orig.apply(object, arguments);
            fns.forEach(function(fn) {
                fn.apply(object, arguments);
            }, object);
        };
    }
};

function isFunction(fn) {
    return toString.call(fn).toLowerCase() === '[object function]';
}