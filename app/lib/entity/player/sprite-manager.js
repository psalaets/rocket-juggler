/*
stuff in here:

facing left or right
running or standing

draw offsets (based on what direction facing)

launcher aim from spot (based on direction)

launch from spot (based on direction and slice)

*/

module.exports = SpriteManager;

function SpriteManager(torso, legs) {
  this.torso = torso;
  this.legs = legs;

  this.facingLeft = false;
  this.running = false;

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
    // determine running vs standing
    var xVelocity = body.velocity[0];

    if (xVelocity < 0) {
      this.facingLeft = true;
      if (!this.running) {
        this.startRunning();
      }
    } else if (xVelocity > 0) {
      this.facingLeft = false;
      if (!this.running) {
        this.startRunning();
      }
    } else {
      if (this.running) {
        this.stopRunning();
      }
    }

    // flip sprite based on direction
    if (this.facingLeft) {
      this.torso.scaleX = -1;
      this.legs.scaleX = -1;

      this.launcherOffset.x = -11;

    } else {
      this.torso.scaleX = 1;
      this.legs.scaleX = 1;

      this.launcherOffset.x = 11;
    }
  },
  startRunning: function() {
    this.running = true;
    this.legs.gotoAndPlay('run');
  },
  stopRunning: function() {
    this.running = false;
    this.legs.gotoAndStop('stand');
  },
  aimChanged: function(body, crosshair) {
    var reference = {
      x: body.position[0] + this.launcherOffset.x,
      y: body.position[1] + this.launcherOffset.y
    };

    this.slice = this.torso.aimChanged(reference, crosshair, this.facingLeft);
  },
  // where rocket starts from relative to launcher
  launchOffset: function() {
    var offsets = [
      {x: 0, y: -115}, // 0
      {x: 42, y: -90},
      {x: 70, y: -65},
      {x: 85, y: -33},
      {x: 86, y: 0},  // 4
      {x: 78, y: 30},
      {x: 56, y: 55},
      {x: 36, y: 75},
      {x: 5, y: 85} // 8
    ];

    return offsets[this.slice] || {x: 0, y: 0};
  }
};
