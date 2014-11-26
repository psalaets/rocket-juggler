var createjs = require('createjs');
var p2 = require('p2');

module.exports = Wall;

function Wall(x, y, width, height) {
  this.view = createView(width, height);
  this.view.x = x;
  this.view.y = y;

  this.body = createBody(x, y, width, height);
}

function createView(width, height) {
  var g = new createjs.Graphics();

  g.beginFill(createjs.Graphics.getRGB(0, 0, 0));
  g.drawRect(0, 0, width, height);

  return new createjs.Shape(g);
}

function createBody(x, y, width, height) {
  var body = new p2.Body({
    // mass = 0 makes it static body
    mass: 0,
    // x and y in p2 are center of shape, so adjust for that
    position: [x + (width / 2), y + (height / 2)]
  });
  body.addShape(new p2.Rectangle(width, height));

  return body;
}
