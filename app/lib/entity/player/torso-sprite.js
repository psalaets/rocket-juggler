var createjs = require('createjs');
var pieSlice = require('pie-slice');

// array indices are the pie slice numbers and also spritesheet frame numbers
var frameNames = [
  'N', 'N-NE', 'NE', 'E-NE',
  'E', 'E-SE', 'SE', 'S-SE',
  'S', 'S-SW', 'SW', 'W-SW',
  'W', 'W-NW', 'NW', 'N-NW'
];

var animations = frameNames.reduce(function(prev, curr, index) {
  prev[curr] = index;
  return prev;
}, {});

var spritesheet = new createjs.SpriteSheet({
  images: ['assets/torso.png'],
  frames: {
    width: 177,
    height: 238,
    regX: 88,
    regY: 119,
    spacing: 1,
    margin: 1
  },
  animations: animations
});

var aimSlices = pieSlice.slice(16, {
  firstSliceFacesUp: true,
  yDown: true
});

var sprite = new createjs.Sprite(spritesheet, 'E');

sprite.aimChanged = function aimChanged(reference, aim, facingLeft) {
  var slice = aimSlices.whatSlice(reference, aim);

  // Since torso is flipped when facing left, we need to show slice that is
  // on the opposite side of y-axis from slice that is shown for facing right.
  if (facingLeft) {
    slice = (16 - slice) % 16;
  }

  this.gotoAndStop(frameNames[slice]);

  return slice;
};

module.exports = sprite;