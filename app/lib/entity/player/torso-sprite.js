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

sprite.aimChanged = function aimChanged(reference, aim) {
  var slice = aimSlices.whatSlice(reference, aim);
  this.gotoAndStop(frameNames[slice]);
};

module.exports = sprite;