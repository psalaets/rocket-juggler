var createjs = require('createjs');
var p2 = require('p2');

module.exports = Wall;

function Wall(position, type) {
  this.body = createBody(position, type);
}

function createBody(position, type) {
  var body = new p2.Body({
    // mass = 0 makes it static body
    mass: 0
  });

  body.addShape(new p2.Plane());

  if (type == 'bottom') {
    body.angle = Math.PI;
    body.position = [0, position];
  } else if (type == 'right') {
    body.angle = Math.PI / 2;
    body.position = [position, 0];
  } else if (type == 'left') {
    body.angle = (3 * Math.PI) / 2;
    body.position = [position, 0];
  } else if (type == 'top') {
    body.angle = 0;
    body.position = [0, position];
  }

  return body;
}