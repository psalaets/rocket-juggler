var createjs = require('createjs');

module.exports = Text;

function Text(x, y, message, color) {
  var text = new createjs.Text(message);
  text.x = x;
  text.y = y;
  text.color = color || '#000000';

  this.view = text;
}

var p = Text.prototype;

Object.defineProperty(p, 'message', {
  get: function() {
    return this.view.text;
  },
  set: function(message) {
    this.view.text = message;
  }
});

Object.defineProperty(p, 'color', {
  get: function() {
    return this.view.color;
  },
  set: function(color) {
    this.view.color = color;
  }
});
