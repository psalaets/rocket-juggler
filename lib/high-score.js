var localStorage = require('local-storage');

module.exports = {
  getHighScore: getHighScore,
  newScore: newScore
};

/**
* Gets current high score.
*
* @returns {number} Current high score or null if there is none
*/
function getHighScore() {
  var highScore = localStorage.getItem('highScore');
  if (highScore) {
    return parseInt(highScore, 10);
  } else {
    return null;
  }
}

/**
* Submit a new score.
*
* @param {number} score - Score of recent game
* @return {boolean} true if score is a new high score, false otherwise
*/
function newScore(score) {
  var highScore = getHighScore() || -1;
  if (score > highScore) {
    localStorage.setItem('highScore', score);
    return true;
  } else {
    return false;
  }
}
