var Text = require('../entity/text');

module.exports = {
  setUp: function(game, score) {
    game.addEntity(new Text(500, 300, 'GAME OVER'));
    game.addEntity(new Text(500, 350, 'Score: ' + score));
    game.addEntity(new Text(500, 400, 'Press <space> to continue'));
  },
  update: function(game, input, tickEvent) {
    if (input.keys[32]) { // spacebar
      game.changeState('title');
    }
  },
  tearDown: function(game) {

  }
};
