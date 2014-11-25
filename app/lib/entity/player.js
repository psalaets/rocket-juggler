var createjs = require('createjs');
var p2 = require('p2');

module.exports = Player;

function Player(x, y) {
  this.view = createView();
  this.view.x = x;
  this.view.y = y;
}

function createView() {
  var g = new createjs.Graphics();

  g.beginFill('#000');
  g.drawRect(0, 0, 64, 128);

  return new createjs.Shape(g);
}

var p = Player.prototype;
