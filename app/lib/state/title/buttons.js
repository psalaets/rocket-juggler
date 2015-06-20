var createjs = require('createjs');
var loader = require('../../loader');

module.exports = function() {
  var spritesheet = new createjs.SpriteSheet({
    images: [
      loader.get('play-button'),
      loader.get('play-button-hover'),
      loader.get('about-button'),
      loader.get('about-button-hover')
    ],
    frames: {
      width: 188,
      height: 44,
      spacing: 0,
      margin: 0
    },
    animations: {
      play: 0,
      'play-hover': 1,
      about: 2,
      'about-hover': 3
    }
  });

  return new createjs.Sprite(spritesheet);
};