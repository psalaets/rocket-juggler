var Text = require('../entity/text');

// gets current high score or null if there is none
function getHighScore() {
  var highScore = localStorage.getItem('highScore');
  if (highScore) {
    return parseInt(highScore, 10);
  } else {
    return null;
  }
}

// see if a new score beat high score
// save new high score and return true if score > current high score
function newScore(score) {
  var highScore = getHighScore() || -1;
  if (score > highScore) {
    localStorage.setItem('highScore', score);
    return true;
  }
}

var titleState = {
  setUp: function(game, score) {
    var highScoreText = 'High Score: '

    // if a score was passed, a game just ended
    if (score !== undefined) {
      if (newScore(score)) {
        highScoreText = 'NEW! ' + highScoreText;
      }

      game.addEntity(new Text(500, 300, 'GAME OVER'));
      game.addEntity(new Text(500, 320, 'Score: ' + score));
    }

    game.addEntity(new Text(500, 100, 'ROCKET JUGGLER'));
    game.addEntity(new Text(500, 120, 'Press <enter> to begin'));
    game.addEntity(new Text(500, 150, highScoreText + (getHighScore() || 'N/A')));
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
