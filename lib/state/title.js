var Text = require('../entity/text');

var titleState = {
  setUp: function(game, score) {
    game.addEntity(new Text(500, 100, 'ROCKET JUGGLER'));
    game.addEntity(new Text(500, 120, 'Press <enter> to begin'));

    // if a score was passed, a game just ended
    if (score !== undefined) {
      game.addEntity(new Text(500, 300, 'GAME OVER'));
      game.addEntity(new Text(500, 320, 'Score: ' + score));
    }
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
