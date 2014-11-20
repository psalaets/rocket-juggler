var Vec2 = require('vec2');
var Rocket = require('./entity/rocket');

module.exports = Launcher;

function Launcher() {
  // minimum time between shots in ms
  this.fireDelay = 300;

  // last time a shot was fired in ms
  this.lastFireTime;

  // current time according to this launcher, in ms
  this.currentTime;

  this.source = {x: 0, y: 0};
  this.target = {x: 0, y: 0};
}

var p = Launcher.prototype;

// change where shots are fired from
p.move = function(x, y) {
  this.source.x = x;
  this.source.y = y;
};

// change where shots are fired to
p.aim = function(x, y) {
  this.target.x = x;
  this.target.y = y;
};

// fire a shot
p.fire = function() {
  if (this.canFire()) {
    var aimVector = new Vec2(this.target.x, this.target.y);
    aimVector.subtract(this.source.x, this.source.y);
    aimVector.normalize();

    var speed = 800;
    aimVector.multiply(speed);

    var rocket = new Rocket(this.source.x, this.source.y);
    rocket.body.velocity = [aimVector.x, aimVector.y];

    this.lastFireTime = this.currentTime;

    return rocket;
  }
};

p.canFire = function() {
  return !this.lastFireTime
    || this.currentTime >= this.lastFireTime + this.fireDelay;
};

p.update = function(tickEvent) {
  this.currentTime = tickEvent.time;
};
