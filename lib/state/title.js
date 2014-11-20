var Text = require('../entity/text');

var titleState = {
  setUp: function(game) {
    game.addEntity(new Text(500, 300, 'ROCKET JUGGLER'));
    game.addEntity(new Text(500, 350, 'Press <enter> to begin'));
  },
  update: function(game, input, tickEvent) {
    if (input.keys[13]) { // enter
      game.changeState('gameplay');
    }
  },
  tearDown: function(game) {

  }
};

module.exports = titleState;
