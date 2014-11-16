var createjs = require('createjs');
var p2 = require('p2');

module.exports = Rocket;

function Rocket(x, y) {
  var radius = 10;

  var graphics = this.createGraphics(radius);
  this.initialize(graphics);

  this.body = this.createBody(x, y, radius);
}

var p = Rocket.prototype = new createjs.Shape();

p.createGraphics = function(radius) {
  var g = new createjs.Graphics();

  // blue inside
  g.beginFill('#0000ff');
  g.drawCircle(0, 0, radius);

  return g;
};

p.createBody = function(x, y, radius) {
  var body = new p2.Body({
    mass: 10,
    position: [x, y]
  });

  // not affected by gravity
  body.gravityScale = 0;

  // doesn't spin
  body.fixedRotation = true;

  body.addShape(new p2.Circle(radius));
  return body;
};

p.update = function(tickEvent) {
  // place shape at body's position
  this.x = this.body.position[0];
  this.y = this.body.position[1];
};
