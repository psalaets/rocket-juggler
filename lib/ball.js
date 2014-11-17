var createjs = require('createjs');
var p2 = require('p2');

module.exports = Ball;

function Ball(x, y, radius) {
  this.view = new createjs.Shape();
  initGraphics(this.view, radius);

  this.x = x;
  this.y = y;

  this.body = createBody(x, y, radius);
}

var p = Ball.prototype;

function initGraphics(shape, radius) {
  var graphics = shape.graphics;

  // 1 pixel black outline
  graphics.setStrokeStyle(1);
  graphics.beginStroke(createjs.Graphics.getRGB(0, 0, 0));

  // red inside
  graphics.beginFill(createjs.Graphics.getRGB(255, 0, 0));

  graphics.drawCircle(0, 0, radius);
};

function createBody(x, y, radius) {
  var body = new p2.Body({
    mass: 1,
    position: [x, y]
  });
  body.addShape(new p2.Circle(radius));
  return body;
};

p.update = function(tickEvent) {
  // place shape at body's position
  this.view.x = this.body.position[0];
  this.view.y = this.body.position[1];
};
