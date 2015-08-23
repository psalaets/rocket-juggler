var ghostBody = require('ghost-body');

var loader = require('../../loader');
var entities = require('../../entity');
var Launcher = require('../../launcher');
var gameConfig = require('../../config/game-config');
var createCollisionHandler = require('./collision-handler');
var createBallSpawnConfigs = require('./ball-spawn-configs');
var makeNumbers = require('./numbers');

function createWalls(game) {
  var gameWidth = game.width;
  var gameHeight = game.height;

  var floorHeight = 16;

  // wall pieces
  var left = entities.leftWall(0);
  var right = entities.rightWall(gameWidth);
  var ceiling = entities.ceiling(0);
  var floor = entities.floor(gameHeight - floorHeight);

  // flag to simplify detecting game over
  floor.isFloor = true;

  return [floor, left, right, ceiling];
}

var gameplayState = {
  init: function(game) {
    this.game = game;
  },
  setUp: function(game) {
    var collisionHandler = createCollisionHandler(game, this);

    game.createWorld(function(world) {
      ghostBody.enable(world);

      world.gravity = [0, 293];

      world.on('beginContact', function(event) {
        var bodyA = event.bodyA;
        var bodyB = event.bodyB;

        var entityA = game.getEntityByBody(bodyA);
        var entityB = game.getEntityByBody(bodyB);

        collisionHandler.handleCollision(entityA, entityB);
      });
    });

    game.withStage(function(stage) {
      // change mouse cursor
      stage.canvas.classList.add('playing');

      // set background
      stage.addChild(new createjs.Bitmap(loader.get('background')));

      var scoreText = this.scoreText = makeNumbers();
      scoreText.x = 15;
      scoreText.y = 15;
      stage.addChild(scoreText);

      // prepare game over message
      var gameOverTitleSize = {
        width: 508,
        height: 100
      };

      var gameOverTitle = new createjs.Bitmap(loader.get('game-over'));
      gameOverTitle.regX = gameOverTitleSize.width / 2;
      gameOverTitle.regY = gameOverTitleSize.height / 2;
      gameOverTitle.x = game.width / 2;
      gameOverTitle.y = 280;
      gameOverTitle.visible = false;
      stage.addChild(gameOverTitle);
      this.gameOverTitle = gameOverTitle;
    }.bind(this));

    createWalls(game).forEach(game.addWall, game);

    // add a ball every 5 seconds
    var ballSpawnConfigs = createBallSpawnConfigs();
    var spawnBall = function() {
      var ball = entities.ball(0, 0);
      ballSpawnConfigs.nextConfig()(ball);

      game.addBall(ball);
      game.timer.addCountdown(gameConfig.ballSpawnDelay, spawnBall);
    }

    spawnBall();

    // one point per second of juggling
    this.score = 0;

    var incrementScore = function() {
      if (!this.gameOverSequence) {
        this.score += 1;
        game.timer.addCountdown(1000, incrementScore);
      }
    }.bind(this);

    incrementScore();

    var playerX = game.width / 2; // middle
    playerX -= 68; // scoot left a bit to line up with title screen's character

    var playerY = 768 - (192 / 2); // half player height from bottom
    playerY -= 16; // move up by floor height

    this.player = entities.player(playerX,  playerY);
    this.player.launcher = new Launcher();
    game.addEntity(this.player);

    // debug related
    // this.actualFps = entities.text(40, 30, '', '#FFFFFF');
    // this.targetFps = entities.text(40, 40, '', '#FFFFFF');

    // game.addEntity(this.actualFps);
    // game.addEntity(this.targetFps);
  },
  update: function(game, input, tickEvent) {
    if (this.gameOverSequence) {
      this.gameOverTitle.visible = true;

      if (this.gameOverMillis > 0) {
        this.gameOverMillis -= tickEvent.delta;
      } else {
        game.changeState('title', this.score);
      }
    }

    this.scoreText.text = String(this.score);
    // this.actualFps.message = createjs.Ticker.getMeasuredFPS();
    // this.targetFps.message = createjs.Ticker.getFPS();

    // react to input
    if (input.keys[16]) { // shift key
      this.fire();
    }

    if (input.keys[65] || input.keys[37]) { // A, left arrow key
      this.player.runLeft();
    } else if (input.keys[68] || input.keys[39]) { // D, right arrow key
      this.player.runRight();
    } else {
      this.player.stop();
    }

    // aim at mouse at all times
    this.player.aim(input.mouseLocation.x, input.mouseLocation.y);

    if (input.mousePressed) {
      this.fire();
    }
  },
  tearDown: function(game) {
    game.timer.clearCountdowns();

    game.withStage(function(stage) {
      // turn off crosshair
      stage.canvas.classList.remove('playing');
    });

    this.gameOverSequence = null;
  },
  fire: function() {
    var rocket = this.player.fire();
    if (rocket) {
      this.game.addRocket(rocket);
    }
  },
  gameOver: function() {
    if (!this.gameOverSequence) {
      this.gameOverSequence = true;
      this.gameOverMillis = 4000;
    }
  }
};

module.exports = gameplayState;