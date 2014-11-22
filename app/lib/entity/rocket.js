var createjs = require('createjs');
var p2 = require('p2');
var ghostBody = require('ghost-body');

var Explosion = require('./explosion');

module.exports = Rocket;

function Rocket(x, y) {
  var radius = 10;

  this.view = createView(radius);
  this.view.x = x;
  this.view.y = y;

  this.body = createBody(x, y, radius);
}

var p = Rocket.prototype;

function createView(radius) {
  var g = new createjs.Graphics();

  // blue inside
  g.beginFill('#0000ff');
  g.drawCircle(0, 0, radius);

  return new createjs.Shape(g);
}

function createBody(x, y, radius) {
  var body = new p2.Body({
    mass: 10,
    position: [x, y]
  });

  // not affected by gravity
  body.gravityScale = 0;

  // doesn't spin
  body.fixedRotation = true;

  // doesn't hit stuff but overlaps still detected
  ghostBody.ghostify(body);

  body.addShape(new p2.Circle(radius));
  return body;
}

p.update = function(tickEvent) {
  // place shape at body's position
  this.view.x = this.body.position[0];
  this.view.y = this.body.position[1];
};

p.explode = function() {
  // flag this for removal
  this.inactive = true;
  // generate explosion
  return new Explosion(this.body.position[0], this.body.position[1]);
};
