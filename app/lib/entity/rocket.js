var createjs = require('createjs');
var p2 = require('p2');
var ghostBody = require('ghost-body');

module.exports = Rocket;

function Rocket(x, y, radius) {
  this.view = createView(radius);
  this.x = this.view.x = x;
  this.y = this.view.y = y;

  this.body = createBody(x, y, radius);

  this.speed = 800;
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
    // doesn't spin
    fixedRotation: true,
    position: [x, y]
  });

  // not affected by gravity
  body.gravityScale = 0;

  // doesn't hit stuff but overlaps still detected
  ghostBody.ghostify(body);

  body.addShape(new p2.Circle(radius));
  return body;
}

p.update = function(tickEvent) {
  // place shape at body's position
  this.x = this.view.x = this.body.position[0];
  this.y = this.view.y = this.body.position[1];
};

/**
* Launch this rocket.
*
* @param {vec2} aimVector - Non normalized aim vector
*/
p.launch = function(aimVector) {
  aimVector.normalize();
  aimVector.multiply(this.speed);

  this.body.velocity = [aimVector.x, aimVector.y];
};
