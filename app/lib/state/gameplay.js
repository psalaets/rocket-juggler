var ghostBody = require('ghost-body');

var Ball = require('../entity/ball');
var Wall = require('../entity/wall');
var Text = require('../entity/text');
var Launcher = require('../launcher');
var createCollisionHandler = require('./gameplay-collision-handler');

function createWalls() {
  var wallWidth = 20;
  var floorHeight = 20;
  var ceilingHeight = 20;
  var extraPadding = 500;

  // wall pieces
  var left = new Wall(0 - extraPadding, 0 + ceilingHeight, wallWidth + extraPadding, (768 - floorHeight) - ceilingHeight);
  var right = new Wall(1024 - wallWidth, 0, wallWidth + extraPadding, 768 - floorHeight);
  var ceiling = new Wall(0, 0 - extraPadding, 1024, ceilingHeight + extraPadding);
  var floor = new Wall(0, 768 - floorHeight, 1024, floorHeight + extraPadding);

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

    createWalls().forEach(game.addWall, game);

    // add a ball every 5 seconds
    var spawnBall = function() {
      game.addBall(new Ball(1024 / 2, 80));
      game.timer.addCountdown(5000, spawnBall);
    }

    spawnBall();

    // one point per second of juggling
    this.score = 0;

    var incrementScore = function() {
      this.score += 1;
      game.timer.addCountdown(1000, incrementScore);
    }.bind(this);

    incrementScore();

    // rockets come from this
    this.launcher = new Launcher();
    this.launcher.move(1024 / 2, 768 - 120);

    game.withStage(function(stage) {
      // fire rocket on mouse click
      stage.on('stagemousedown', this.mouseFire, this);

      // change mouse cursor
      stage.canvas.classList.add('playing');
    }.bind(this));

    // debug related
    this.actualFps = new Text(40, 30, '');
    this.targetFps = new Text(40, 40, '');
    this.scoreText = new Text(40, 50, '');

    game.addEntity(this.actualFps);
    game.addEntity(this.targetFps);
    game.addEntity(this.scoreText);
  },
  update: function(game, input, tickEvent) {
    this.actualFps.message = createjs.Ticker.getMeasuredFPS();
    this.targetFps.message = createjs.Ticker.getFPS();
    this.scoreText.message = 'Score: ' + this.score;

    this.launcher.aim(input.mouseLocation.x, input.mouseLocation.y);
    this.launcher.update(tickEvent);

    // react to input
    if (input.keys[16]) { // shift
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
    var rocket = this.launcher.fire();
    if (rocket) {
      this.game.addRocket(rocket);
    }
  },
  mouseFire: function(mouseEvent) {
    this.launcher.aim(mouseEvent.stageX, mouseEvent.stageY);
    this.fire();
  }
};

module.exports = gameplayState;