var ghostBody = require('ghost-body');

var loader = require('../loader');
var entities = require('../entity');
var Launcher = require('../launcher');
var createCollisionHandler = require('./gameplay-collision-handler');
var gameConfig = require('../config/game-config');
var createSpawnLocations = require('./spawn-locations');

function createWalls(game) {
  var gameWidth = game.width;
  var gameHeight = game.height;

  var floorHeight = 16;
  // make walls extra thick to prevent physics tunneling
  var extraPadding = 500;

  // wall pieces
  var left = entities.wall(0 - extraPadding, 0, extraPadding, gameHeight - floorHeight);
  var right = entities.wall(gameWidth, 0, extraPadding, gameHeight - floorHeight);
  var ceiling = entities.wall(0 - extraPadding, 0 - extraPadding, gameWidth + (2 * extraPadding), extraPadding);
  var floor = entities.wall(0 - extraPadding, gameHeight - floorHeight, gameWidth + (2 * extraPadding), floorHeight + extraPadding);

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
    }.bind(this));

    createWalls(game).forEach(game.addWall, game);

    // add a ball every 5 seconds
    var ballSpawnLocations = createSpawnLocations();
    var spawnBall = function() {
      var location = ballSpawnLocations.nextLocation();

      var ball = entities.ball(location.x, location.y);
      game.addBall(ball);
      game.timer.addCountdown(gameConfig.get('ballSpawnDelay'), spawnBall);
    }

    spawnBall();

    // one point per second of juggling
    this.score = 0;

    var incrementScore = function() {
      this.score += 1;
      game.timer.addCountdown(1000, incrementScore);
    }.bind(this);

    incrementScore();

    var playerX = 1024 / 2; // middle
    playerX -= 68; // scoot left a bit to line up with title screen's character

    var playerY = 768 - (192 / 2); // half player height from bottom
    playerY -= 16; // move up by floor height

    this.player = entities.player(playerX,  playerY);
    this.player.launcher = new Launcher();
    game.addEntity(this.player);

    // debug related
    var white = '#FFFFFF';
    this.actualFps = entities.text(40, 30, '', '#FFFFFF');
    this.targetFps = entities.text(40, 40, '', '#FFFFFF');
    this.scoreText = entities.text(40, 50, '', '#FFFFFF');

    game.addEntity(this.actualFps);
    game.addEntity(this.targetFps);
    game.addEntity(this.scoreText);
  },
  update: function(game, input, tickEvent) {
    this.actualFps.message = createjs.Ticker.getMeasuredFPS();
    this.targetFps.message = createjs.Ticker.getFPS();
    this.scoreText.message = 'Score: ' + this.score;

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
  },
  fire: function() {
    var rocket = this.player.fire();
    if (rocket) {
      this.game.addRocket(rocket);
    }
  }
};

module.exports = gameplayState;