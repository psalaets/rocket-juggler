var createjs = require('createjs');
var p2 = require('p2');
var loader = require('../loader');

module.exports = Ball;

function Ball(x, y, radius) {
  this.view = createView(radius);
  this.view.x = x;
  this.view.y = y;

  this.body = createBody(x, y, radius);
}

function createView(radius) {
  var spritesheet = new createjs.SpriteSheet({
    images: [loader.get('meteor')],
    frames: {
      width: 100,
      height: 100,
      regX: 50,
      regY: 50
    }
  });

  var sprite = new createjs.Sprite(spritesheet);
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
    mass: 1,
    // doesn't spin
    fixedRotation: true,
    position: [x, y]
  });
  body.addShape(new p2.Circle(radius));
  body.gravityScale = 0.5;
  return body;
};

var p = Ball.prototype;
p.update = function(tickEvent) {
  // place shape at body's position
  this.view.x = this.body.position[0];
  this.view.y = this.body.position[1];
};
