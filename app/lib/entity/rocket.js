var createjs = require('createjs');
var p2 = require('p2');
var ghostBody = require('ghost-body');
var Vec2 = require('vec2');

var loader = require('../loader');

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
  var spritesheet = new createjs.SpriteSheet({
    images: [loader.get('rocket')],
    frames: {
      width: 20,
      height: 20,
      regX: 10,
      regY: 10
    }
  });

  var sprite = new createjs.Sprite(spritesheet);
  return sprite;

  // var g = new createjs.Graphics();

  // // blue inside
  // g.beginFill('#0000ff');
  // g.drawCircle(0, 0, radius);

  // var shape = new createjs.Shape(g);
  // shape.cache(-radius, -radius, radius * 2, radius * 2);
  // return shape;
}

function createBody(x, y, radius) {
  var body = new p2.Body({
    mass: 10,
    // doesn't spin
    fixedRotation: true,
    position: [x, y],
    // turn off damping which is like air resistance?
    damping: 0
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
  this.pointAt(aimVector);

  aimVector.multiply(this.speed);

  this.body.velocity = [aimVector.x, aimVector.y];
};

/**
* Rotate this rocket so it points at an aim vector
*
* @param {vec2} normalizedAimVector - aim vector with length near or equal to 1
*/
p.pointAt = function(normalizedAimVector) {
  var radians = new Vec2(0, -1).angleTo(normalizedAimVector);
  var degrees = radians * (180 / Math.PI);

  if (degrees < 0) {
    degrees = 360 - Math.abs(degrees);
  }

  this.view.rotation = degrees;
};
