var createjs = require('createjs');
var p2 = require('p2');

module.exports = Player;

// x and y are center of rect
function Player(x, y) {
  var width = 64;
  var height = 128;

  this.view = createView(x, y, width, height);
  this.body = createBody(x, y, width, height);
}

function createView(x, y, width, height) {
  var g = new createjs.Graphics();

  g.beginFill('#000');
  g.drawRect(-width / 2, -height / 2, width, height);

  var shape = new createjs.Shape(g);
  shape.x = x;
  shape.y = y;
  return shape;
}

function createBody(x, y, width, height) {
  var body = new p2.Body({
    mass: 1,
    position: [x, y]
  });

  // not affected by gravity
  body.gravityScale = 0;

  // doesn't spin
  body.fixedRotation = true;

  body.addShape(new p2.Rectangle(width, height));
  return body;
}

var p = Player.prototype;
