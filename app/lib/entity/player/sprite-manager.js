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
      x: body.position[0],
      y: body.position[1]
    };

    this.torso.aimChanged(reference, crosshair, this.facingLeft);
  },
  // how far from body's position that launcher aims from
  launcherOffset: {
    x: 0,
    // y offset never changes
    y: -30
  }
};