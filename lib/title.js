var createjs = require('createjs');
var gameplay = require('./gameplay');

var titleState = {
  setUp: function(game) {
    game.addEntity(textEntity(20, 20, 'ROCKET JUGGLER'));
    game.addEntity(textEntity(20, 60, 'Press <enter> to begin'));
  },
  update: function(game, input, tickEvent) {
    if (input.keys[13]) { // enter
      game.changeState(gameplay);
    }
  },
  tearDown: function(game) {

  }
};

function textEntity(x, y, message) {
  var text = new createjs.Text(message);
  text.x = x;
  text.y = y;

  return {
    view: text
  };
}

module.exports = titleState;
