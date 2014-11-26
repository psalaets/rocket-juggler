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

  /**
  * Draw rectangle with rounded top (using a circle to make rounded top)
  */

  var radius = width / 2;
  // y value for top edge of player, relative to player center
  var topOffset = -height / 2;
  // x value for left edge of player, relative to player center
  var leftOffset = -width / 2;

  g.drawCircle(0, topOffset + radius, radius);
  g.drawRect(topOffset + radius, leftOffset, width, height);

  var shape = new createjs.Shape(g);
  shape.x = x;
  shape.y = y;
  return shape;
}

function createBody(x, y, width, height) {
  var body = new p2.Body({
    // can't collide with it, only moves when its velocity is manually changed
    type: p2.Body.KINEMATIC,
    position: [x, y]
  });

  // not affected by gravity
  body.gravityScale = 0;

  // doesn't spin
  body.fixedRotation = true;

  var halfHeight = height / 2;
  var radius = width / 2;

  body.addShape(new p2.Circle(radius), [0, radius - halfHeight]);
  body.addShape(new p2.Rectangle(width, height - radius, [0, -radius / 2]));
  return body;
}

var p = Player.prototype;

p.update = function(tickEvent) {
  this.view.x = this.body.position[0];
  this.view.y = this.body.position[1];
};
