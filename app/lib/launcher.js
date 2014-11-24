var Vec2 = require('vec2');
var entities = require('./entity');

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
    this.lastFireTime = this.currentTime;

    var rocket = entities.rocket(this.source.x, this.source.y);
    rocket.launch(this.aimVector());
    return rocket;
  }
};

p.aimVector = function() {
  var vector = new Vec2(this.target.x, this.target.y);
  vector.subtract(this.source.x, this.source.y);
  return vector;
};

p.canFire = function() {
  return !this.lastFireTime
    || this.currentTime >= this.lastFireTime + this.fireDelay;
};

p.update = function(tickEvent) {
  this.currentTime = tickEvent.time;
};
