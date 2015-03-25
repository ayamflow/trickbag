trickbag
===

Add support for stacked mixins (separate behaviour) into any prototype.
Inspired by [Vue](vuejs.org) & [React](http://facebook.github.io/react/) mixins, and [Backbone Cocktail](https://github.com/onsi/cocktail).

It is useful to make your views/classes lighter and export common behavior in helpers. Some example use cases:

* listening to the `resize` event and calling the appropriate method
* listening to a mediator on object creation / unbinding the listener on object destruction
* adding different behaviours on the same object hooks (`init`, `render` ...)
* inheritance without `super`
* ...

## Installation

`npm i trickbag --save`

## Usage

`trickbag([mixins...], object);`
* `mixins` is an object (or an array of objects) containing methods; in other words, of mixins.
* `object` is the object to apply these mixins to.

## "Stacks"

Different mixins used on the same object can have methods with identical names.
When the mixins are processed, trickbag properly stack all methods with the same name by wrapping them in a parent method, preserving the call order.
For instance you can have an object with an `init` method. If your mixin also has the `init` method, it will be called after the object's one. That allows to easily plug behaviour on your custom classes lifecycle.

## Example

```js

var View = function(params) {
  trickbag(params.mixins, this);
};

var resizeMixin = {
  init: function() {
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
    console.log('Listening to resize')
  },

  onResize: function() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  },

  destroy: function() {
    window.removeEventListener('resize', this.onResize);
  }
};

var fooMixin = {
  init: function() {
    console.log('Foo foo');
  }
}

var v = new View({
  mixins: [resizeMixin, fooMixin]
});

v.init(); // "Listening to resize", "Foo foo"


```