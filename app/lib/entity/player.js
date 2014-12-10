var createjs = require('createjs');
var p2 = require('p2');

module.exports = Player;

// x and y are center of rect
function Player(x, y) {
  this.width = 64;
  this.height = 192;

  this.view = createContainer(x, y, this.width, this.height);
  this.view.addChild(createRect(width, height));
  this.view.addChild(createMesh());

  this.body = createBody(x, y, this.width, this.height);
}

function createContainer(x, y, width, height) {
  var c = new createjs.Container();
  c.x = x;
  c.y = y;
  return c;
}

function createRect(width, height) {
  // y value for top edge of player, relative to player center
  var topOffset = -height / 2;
  // x value for left edge of player, relative to player center
  var leftOffset = -width / 2;

  var g = new createjs.Graphics();
  g.beginFill('#bbbbbb');
  g.drawRect(leftOffset, topOffset, width, height);
  g.endFill();

  return createjs.Shape(g);
}

function createMesh() {
  var g = new createjs.Graphics();
  g.beginStroke('#f00');

  var radius = 100;
  g.drawCircle(0, 0, radius);

  drawQuarterSpokes(g, radius, 1, 1); // bottom right
  drawQuarterSpokes(g, radius, 1, -1); // top right
  drawQuarterSpokes(g, radius, -1, 1); // bottom left
  drawQuarterSpokes(g, radius, -1, -1); // top left

  return new createjs.Shape(g);
}

function drawQuarterSpokes(g, radius, xModifier, yModifier) {
  // slice boundaries are 22.5 degrees apart
  [11.25, 33.75, 56.25, 78.75].forEach(function(angle) {
    var point = pointOnCircle(radius, angle);
    point[0] = xModifier * point[0];
    point[1] = yModifier * point[1];

    g.moveTo(0, 0).lineTo.apply(g, point);
  });
}

// returns [x, y]
function pointOnCircle(radius, degrees) {
  return [
    Math.sin(degreesToRadians(degrees)) * radius,
    Math.cos(degreesToRadians(degrees)) * radius
  ];
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function createBody(x, y, width, height) {
  var body = new p2.Body({
    mass: 1,
    // doesn't spin
    fixedRotation: true,
    position: [x, y]
  });

  body.addShape(new p2.Rectangle(width, height));
  return body;
}

var p = Player.prototype;

p.update = function(tickEvent) {
  // move image to body location
  this.view.x = this.body.position[0];
  this.view.y = this.body.position[1];

  this.updateLauncher(tickEvent);
};

p.aim = function(x, y) {
  this.launcher.aim(x, y);
}

p.fire = function() {
  return this.launcher.fire();
}

p.updateLauncher = function(tickEvent) {
  if (this.launcher) {
    this.launcher.update(tickEvent);

    var x = this.body.position[0];
    var y = this.body.position[1];

    // move launcher with player
    this.launcher.move(x, y - (this.height / 2) - 10);
  }
}

p.moveLeft = function(speed) {
  this.body.velocity[0] = -speed;
};

p.moveRight = function(speed) {
  this.body.velocity[0] = speed;
};

p.stop = function() {
  this.body.velocity[0] = 0;
};
