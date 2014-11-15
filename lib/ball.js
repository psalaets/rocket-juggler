var createjs = require('createjs');
var p2 = require('p2');

module.exports = Ball;

function Ball(x, y, radius) {
  var graphics = this.createGraphics(radius);
  this.initialize(graphics); // from Shape.prototype

  this.body = this.createBody(x, y, radius);
}

var p = Ball.prototype = new createjs.Shape();

p.createGraphics = function(radius) {
  var graphics = new createjs.Graphics();

  // 1 pixel black outline
  graphics.setStrokeStyle(1);
  graphics.beginStroke(createjs.Graphics.getRGB(0, 0, 0));

  // red inside
  graphics.beginFill(createjs.Graphics.getRGB(255, 0, 0));

  graphics.drawCircle(0, 0, radius);
  return graphics;
};

p.createBody = function(x, y, radius) {
  var body = new p2.Body({
    mass: 1,
    position: [x, y]
  });
  body.addShape(new p2.Circle(radius));
  return body;
};

p.update = function(tickEvent) {
  // place shape at body's position
  this.x = this.body.position[0];
  this.y = this.body.position[1];
};
