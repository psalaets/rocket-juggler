var Text = require('../entity/text');
var highScore = require('../high-score');

var titleState = {
  setUp: function(game, score) {
    var highScoreText = 'High Score: '

    // if a score was passed, a game just ended
    if (score !== undefined) {
      if (highScore.newScore(score)) {
        highScoreText = 'NEW! ' + highScoreText;
      }

      game.addEntity(new Text(500, 300, 'GAME OVER'));
      game.addEntity(new Text(500, 320, 'Score: ' + score));
    }

    highScoreText += (highScore.getHighScore() || 'N/A');

    game.addEntity(new Text(500, 100, 'ROCKET JUGGLER'));
    game.addEntity(new Text(500, 120, 'Press <enter> to begin'));
    game.addEntity(new Text(500, 150, highScoreText));
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