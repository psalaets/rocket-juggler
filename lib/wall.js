var createjs = require('createjs');
var p2 = require('p2');

module.exports = Wall;

function Wall(x, y, width, height) {
  var graphics = this.createGraphics(width, height);
  this.initialize(graphics);

  this.x = x;
  this.y = y;

  this.body = this.createBody(x, y, width, height);
}

var p = Wall.prototype = new createjs.Shape();

p.createGraphics = function(width, height) {
  var g = new createjs.Graphics();

  // gray inside
  g.beginFill(createjs.Graphics.getRGB(0, 0, 0));
  g.drawRect(0, 0, width, height);

  return g;
};

p.createBody = function(x, y, width, height) {
  var body = new p2.Body({
    // mass = 0 makes it static body
    mass: 0,
    // x and y in p2 are center of shape, so adjust for that
    position: [x + (width / 2), y + (height / 2)]
  });
  body.addShape(new p2.Rectangle(width, height));

  return body;
};
