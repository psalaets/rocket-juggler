var gameConfig = require('../../config/game-config');

/*
stuff in here:

facing left or right
running or standing

draw offsets (based on what direction facing)

launcher aim from spot (based on direction)

launch from spot (based on direction and slice)

*/

module.exports = SpriteManager;

function SpriteManager(body, torso, legs) {
  this.body = body;
  this.torso = torso;
  this.legs = legs;

  this.facingLeft = false;
  this.running = false;

  // player left/right speed
  this.horizontalSpeed = 0;
  this.runningSpeed = gameConfig.get('playerSpeed');

  // how far from body's position that launcher aims from
  this.launcherOffset = {
    x: 0,
    // y offset never changes
    y: -30
  };

  // current slice aim is in
  this.slice = null;
}

SpriteManager.prototype = {
  update: function(body) {
    body.velocity[0] = this.horizontalSpeed;
  },
  startRunning: function() {
    this.running = true;
    this.legs.gotoAndPlay('run');
  },
  stopRunning: function() {
    this.running = false;
    this.legs.gotoAndStop('stand');

    this.horizontalSpeed = 0;
  },

  runRight: function() {
    this.faceRight();
    if (!this.running) {
      this.startRunning();
    }
    this.horizontalSpeed = this.runningSpeed;
  },

  runLeft: function() {
    this.faceLeft();
    if (!this.running) {
      this.startRunning();
    }
    this.horizontalSpeed = -this.runningSpeed;
  },
  faceLeft: function() {
    this.facingLeft = true;

    // flip sprite to face left
    this.torso.scaleX = -1;
    this.legs.scaleX = -1;

    // sprite isn't symmetrical so launcher position needs to change
    this.launcherOffset.x = -11;
  },
  faceRight: function() {
    this.facingLeft = false;

    // flip sprite to face right
    this.torso.scaleX = 1;
    this.legs.scaleX = 1;

    // sprite isn't symmetrical so launcher position needs to change
    this.launcherOffset.x = 11;
  },

  aimChanged: function(body, crosshair) {
    var reference = {
      x: body.position[0] + this.launcherOffset.x,
      y: body.position[1] + this.launcherOffset.y
    };

    this.slice = this.torso.aimChanged(reference, crosshair, this.facingLeft);
  },
  /**
  * Tells where rocket starts from relative to launcher.
  *
  * @param {vec2} aimVector normalized aim vector
  */
  launchOffset: function(aimVector) {
    // up-facing slice fires from a bit further away
    var scaleFactor = (this.slice === 0) ? 115 : 85;

    return aimVector.multiply(scaleFactor);
  }
};
