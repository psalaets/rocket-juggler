var createjs = require('createjs');
var p2 = require('p2');

module.exports = Player;

// x and y are center of rect
function Player(x, y) {
  this.width = 64;
  this.height = 128;

  this.view = createView(x, y, this.width, this.height);
  this.body = createBody(x, y, this.width, this.height);
}

function createView(x, y, width, height) {
  var g = new createjs.Graphics();

  g.beginFill('#bbbbbb');

  // y value for top edge of player, relative to player center
  var topOffset = -height / 2;
  // x value for left edge of player, relative to player center
  var leftOffset = -width / 2;

  g.drawRect(leftOffset, topOffset, width, height);

  var shape = new createjs.Shape(g);
  shape.x = x;
  shape.y = y;
  return shape;
}

function createBody(x, y, width, height) {
  var body = new p2.Body({
    // can't push it via collision, only moves when its velocity is manually changed
    type: p2.Body.KINEMATIC,
    // doesn't spin
    fixedRotation: true,
    position: [x, y]
  });

  // not affected by gravity
  body.gravityScale = 0;

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
