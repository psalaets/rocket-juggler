var createjs = require('createjs');

var entities = require('../../entity');
var highScore = require('../../high-score');
var loader = require('../../loader');

var titleState = {
  init: function(game) {
    this.game = game;
  },
  setUp: function(game, score) {
    var highScoreText = 'High Score: '

    // if a score was passed, a game just ended
    if (score !== undefined) {
      if (highScore.newScore(score)) {
        highScoreText = 'NEW! ' + highScoreText;
      }

      // game.addEntity(entities.text(500, 300, 'GAME OVER'));
      // game.addEntity(entities.text(500, 320, 'Score: ' + score));
    }

    game.withStage(function(stage) {
      // set background
      stage.addChild(new createjs.Bitmap(loader.get('title-screen')));

      var insertCoinWidth = 172;
      var insertCoinHeight = 26;

      var insertCoin = new createjs.Bitmap(loader.get('insert-coin'));
      insertCoin.regX = insertCoinWidth / 2;
      insertCoin.regY = insertCoinHeight / 2;
      insertCoin.x = 1024 / 2;
      insertCoin.y = 280;
      stage.addChild(insertCoin);

      function cycleInsertCoin() {
        insertCoin.visible = !insertCoin.visible;
        game.timer.addCountdown(700, cycleInsertCoin);
      }

      cycleInsertCoin();

      var buttonWidth = 188;
      var buttonHeight = 44;

      var start = new createjs.Bitmap(loader.get('play-button'));
      start.regX = buttonWidth / 2;
      start.regY = buttonHeight / 2;
      start.x = 1024 / 2;
      start.y = 395;
      stage.addChild(start);

      start.on('click', function() {
        game.changeState('gameplay');
      });

      var about = new createjs.Bitmap(loader.get('about-button'));
      about.regX = buttonWidth / 2;
      about.regY = buttonHeight / 2;
      about.x = 1024 / 2;
      about.y = 465;
      stage.addChild(about);

      about.on('click', function() {
        game.changeState('help');
      });
    }.bind(this));

    highScoreText += (highScore.getHighScore() || 'N/A');

    // game.addEntity(entities.text(500, 100, 'ROCKET JUGGLER'));
    // game.addEntity(entities.text(500, 120, 'Press <enter> to begin'));
    // game.addEntity(entities.text(500, 140, 'Press <h> for help'));
    // game.addEntity(entities.text(500, 170, highScoreText));
  },
  update: function(game, input, tickEvent) {

  },
  tearDown: function(game) {
    game.timer.clearCountdowns();
  }
};

module.exports = titleState;
