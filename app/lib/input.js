var document = require('window').document;

// hash of keys that are currently pressed
var keys = {};

document.onkeydown = function(event) {
  keys[event.keyCode] = true;
};

document.onkeyup = function(event) {
  delete keys[event.keyCode];
};

module.exports = {
  keys: keys,
  mouseLocation: {
    x: 0,
    y: 0
  },
  updateMouseLocation: function(x, y) {
    this.mouseLocation.x = x;
    this.mouseLocation.y = y;
  }
};
