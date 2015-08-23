var createjs = require('createjs');
var loader = require('../../loader');

module.exports = function() {
  var spriteSheet = new createjs.SpriteSheet({
    images: [loader.get('numbers')],
    frames: [
      // x, y, width, height
      [0, 0, 9, 15],   // 0
      [12, 0, 9, 15],  // 1
      [24, 0, 9, 15],  // 2
      [36, 0, 12, 15], // 3
      [48, 0, 12, 15], // 4
      [63, 0, 9, 15],  // 5
      [75, 0, 9, 15],  // 6
      [84, 0, 9, 15],  // 7
      [96, 0, 9, 15],  // 8
      [108, 0, 9, 15]  // 9
    ],
    animations: {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9
    }
  });

  var text = new createjs.BitmapText();
  text.spriteSheet = spriteSheet;
  text.letterSpacing = 3;
  return text;
};