var createjs = require('createjs');

var spritesheet = new createjs.SpriteSheet({
  images: ['assets/legs.png'],
  frames: {
    width: 177,
    height: 238,
    regX: 88,
    regY: 119,
    spacing: 1,
    margin: 1
  },
  animations: {
    run: {
      frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      // TODO figure out which of these is needed or both
      speed: 0.4
      //framerate: 30
    }
  }
});

var sprite = new createjs.Sprite(spritesheet, 'run');

module.exports = sprite;