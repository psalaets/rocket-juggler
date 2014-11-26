var createjs = require('createjs');
var p2 = require('p2');

module.exports = Ball;

function Ball(x, y, radius) {
  this.view = createView(radius);
  this.view.x = x;
  this.view.y = y;

  this.body = createBody(x, y, radius);
}

function createView(radius) {
  var graphics = new createjs.Graphics();

  // 1 pixel black outline
  graphics.setStrokeStyle(1);
  graphics.beginStroke('#000000');

  // red inside
  graphics.beginFill('#ff0000');

  graphics.drawCircle(0, 0, radius);
  return new createjs.Shape(graphics);
};

function createBody(x, y, radius) {
  var body = new p2.Body({
    mass: 1,
    position: [x, y]
  });
  body.addShape(new p2.Circle(radius));
  return body;
};

var p = Ball.prototype;
p.update = function(tickEvent) {
  // place shape at body's position
  this.view.x = this.body.position[0];
  this.view.y = this.body.position[1];
};
