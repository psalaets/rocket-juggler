var createjs = require('createjs');

var entities = require('../../entity');
var highScore = require('../../high-score');
var loader = require('../../loader');

var createButton = require('./buttons');

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
      // turn on mouse events on display objects
      stage.enableMouseOver();

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

      var playButton = createButton();
      playButton.regX = buttonWidth / 2;
      playButton.regY = buttonHeight / 2;
      playButton.x = 1024 / 2;
      playButton.y = 395;
      playButton.gotoAndStop('play');

      stage.addChild(playButton);

      playButton.on('click', function() {
        game.changeState('gameplay');
      });

      playButton.on('mouseover', function() {
        startButtonHover(stage);
        playButton.gotoAndStop('play-hover');
      });

      playButton.on('mouseout', function() {
        stopButtonHover(stage);
        playButton.gotoAndStop('play');
      });

      var aboutButton = createButton();
      aboutButton.regX = buttonWidth / 2;
      aboutButton.regY = buttonHeight / 2;
      aboutButton.x = 1024 / 2;
      aboutButton.y = 465;
      aboutButton.gotoAndStop('about');
      stage.addChild(aboutButton);

      aboutButton.on('click', function() {
        // game.changeState('help');

        document.getElementById('about').scrollIntoView()
      });

      aboutButton.on('mouseover', function() {
        startButtonHover(stage);
        aboutButton.gotoAndStop('about-hover');
      });

      aboutButton.on('mouseout', function() {
        stopButtonHover(stage);
        aboutButton.gotoAndStop('about');
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

    game.withStage(function(stage) {
      // turn off mouse events on display objects
      stage.enableMouseOver(0);

      stopButtonHover(stage);
    });
  }
};

function startButtonHover(stage) {
  stage.canvas.classList.add('hover-button');
}

function stopButtonHover(stage) {
  stage.canvas.classList.remove('hover-button');
}

module.exports = titleState;
