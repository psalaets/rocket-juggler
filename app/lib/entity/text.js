var createjs = require('createjs');

module.exports = Text;

function Text(x, y, message) {
  var text = new createjs.Text(message);
  text.x = x;
  text.y = y;

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
