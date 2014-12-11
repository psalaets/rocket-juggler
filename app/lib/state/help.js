var entities = require('../entity');

var helpState = {
  init: function(game) {
    this.game = game;
  },
  setUp: function(game, score) {
    var messages = [
      '***don\'t drop a ball***',
      'a, left arrow = move left',
      'd, right arrow = move right',
      'mouse aims',
      'mouse click, shift key = shoot'
    ].forEach(function(msg, index) {
      var yOffset = 20 * index;
      game.addEntity(entities.text(500, 150 + yOffset, msg));
    });

    game.addEntity(entities.text(500, 100, 'Press <esc> to return'));
  },
  update: function(game, input, tickEvent) {
    if (input.keys[27]) { // escape
      game.changeState('title');
    }
  },
  tearDown: function(game) {

  }
};

module.exports = helpState;
