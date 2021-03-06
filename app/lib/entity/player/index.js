var createjs = require('createjs');
var p2 = require('p2');
var torsoSprite = require('./torso-sprite');
var legsSprite = require('./legs-sprite');

var SpriteManager = require('./sprite-manager');

module.exports = Player;

// x and y are center of rect
function Player(x, y) {
  this.width = 64;
  this.height = 192;

  this.view = createContainer(x, y);
  //this.view.addChild(createRect(this.width, this.height));

  this.legs = legsSprite();
  this.legs.y = -20; // hack for now: offset by floor height
  this.view.addChild(this.legs);

  this.torso = torsoSprite();
  this.torso.y = -20; // hack for now: offset by floor height
  this.view.addChild(this.torso);

  // this.wagonWheel = createWagonWheel();
  // this.view.addChild(this.wagonWheel);

  // this.wagonWheel2 = createWagonWheel(75);
  // this.view.addChild(this.wagonWheel2);

  // this.aimLine = createAimLine();
  // this.view.addChild(this.aimLine);

  this.body = createBody(x, y, this.width, this.height);

  this.spriteManager = new SpriteManager(this.body, this.torso, this.legs);
}

function createContainer(x, y) {
  var c = new createjs.Container();
  c.x = x;
  c.y = y;
  return c;
}

function createAimLine() {
  var g = new createjs.Graphics();
  return new createjs.Shape(g);
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

  var shape = new createjs.Shape(g);
  // try to reduce draw cost since rect never changes
  shape.cache(leftOffset, topOffset, width, height);
  return shape;
}

function createWagonWheel(radius) {
  var g = new createjs.Graphics();
  g.beginStroke('#f00');

  radius = radius || 200;
  g.drawCircle(0, 0, radius);

  drawQuarterSpokes(g, radius, 1, 1); // bottom right
  drawQuarterSpokes(g, radius, 1, -1); // top right
  drawQuarterSpokes(g, radius, -1, 1); // bottom left
  drawQuarterSpokes(g, radius, -1, -1); // top left

  var shape = new createjs.Shape(g);
  // try to reduce draw cost since wagon wheel never changes
  shape.cache(-radius, -radius, radius * 2, radius * 2);
  return shape;
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
  this.view.x = Math.floor(this.body.position[0]);
  this.view.y = Math.floor(this.body.position[1]);

  this.updateLauncher(tickEvent);

  this.spriteManager.update();
};

p.aim = function(x, y) {
  this.launcher.aim(x, y);

  var crosshair = {
    x: x,
    y: y
  };

  this.spriteManager.aimChanged(crosshair);
}

p.fire = function() {
  var x = this.launcher.source.x;
  var y = this.launcher.source.y;

  var aimVector = this.launcher.aimVector();
  aimVector.normalize();

  var launchOffset = this.spriteManager.launchOffset(aimVector);

  x += launchOffset.x;
  y += launchOffset.y;

  return this.launcher.fire(x, y);
}

p.updateLauncher = function(tickEvent) {
  if (this.launcher) {
    this.launcher.update(tickEvent);

    var x = this.body.position[0];
    var y = this.body.position[1];

    // move launcher with player
    var launcherX = x + this.spriteManager.launcherOffset.x;
    var launcherY = y + this.spriteManager.launcherOffset.y;

    this.launcher.moveTo(launcherX, launcherY);

    if (this.wagonWheel) {
      // wagon wheel is relative to player sprite so subtract player x/y
      this.wagonWheel.x = this.launcher.source.x - x;
      this.wagonWheel.y = this.launcher.source.y - y;
    }

    if (this.wagonWheel2) {
      // wagon wheel is relative to player sprite so subtract player x/y
      this.wagonWheel2.x = this.launcher.source.x - x;
      this.wagonWheel2.y = this.launcher.source.y - y;
    }

    // update aim line for debug purposes
    this.aimLine && this.aimLine.graphics
      .clear()
      .beginStroke('#00f')
      // these locations are relative to player position
      .moveTo(this.launcher.source.x - x, this.launcher.source.y - y)
      .lineTo(this.launcher.target.x - x, this.launcher.target.y - y);
  }
}

p.runLeft = function() {
  this.spriteManager.runLeft();
};

p.runRight = function() {
  this.spriteManager.runRight();
};

p.stop = function() {
  this.spriteManager.stopRunning();
};