var createjs = require('createjs');
var p2 = require('p2');
var ghostBody = require('ghost-body');

var loader = require('../loader');

module.exports = Ball;

function Ball(x, y, radius) {
  this.view = createView(radius);
  this.view.x = x;
  this.view.y = y;

  this.radius = radius;
  this.body = createBody(x, y, radius);

  // starts off not hitting stuff
  ghostBody.ghostify(this.body);
}

function createView(radius) {
  if (!Ball.spriteSheet) {
    Ball.spriteSheet = new createjs.SpriteSheet({
      images: [loader.get('meteor')],
      frames: {
        width: 100,
        height: 100,
        regX: 50,
        regY: 50
      }
    });
  }

  var sprite = new createjs.Sprite(Ball.spriteSheet);
  return sprite;

  // var graphics = new createjs.Graphics();

  // // red inside
  // graphics.beginFill('#ff0000');
  // graphics.drawCircle(0, 0, radius);

  // var shape = new createjs.Shape(graphics);
  // shape.cache(-radius, -radius, radius * 2, radius * 2);
  // return shape;
};

function createBody(x, y, radius) {
  var body = new p2.Body({
    mass: 3,
    // doesn't spin
    fixedRotation: true,
    position: [x, y],
    // turn off damping which is like air resistance?
    damping: 0
  });
  body.addShape(new p2.Circle(radius));
  body.gravityScale = 0.5;
  return body;
};

var p = Ball.prototype;
p.update = function(tickEvent) {
  var body = this.body;
  var x = body.position[0];
  var y = body.position[1];

  // place shape at body's position
  this.view.x = x;
  this.view.y = y;

  // it's fully on screen, it's fair game now
  if (ghostBody.isGhost(body) && y > this.radius + 1) {
    this.fairGame = true;
    ghostBody.unghostify(body);
  }
};

p.moveTo = function(x, y) {
  this.body.position[0] = x;
  this.body.position[1] = y;
};

p.setVelocity = function(x, y) {
  this.body.velocity[0] = x;
  this.body.velocity[1] = y;
};