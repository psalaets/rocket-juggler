var ghostBody = require('ghost-body');

var Ball = require('../entity/ball');
var Wall = require('../entity/wall');
var Rocket = require('../entity/rocket');
var Explosion = require('../entity/explosion');
var Text = require('../entity/text');
var Launcher = require('../launcher');
var createCollisionHandler = require('../collision-handler');

var gameplayState = {
  setUp: function(game) {
    var collisionHandler = createCollisionHandler();
    collisionHandler
      // rockets explode on walls and balls
      .addHandler(function(entityA) {
        return entityA instanceof Rocket;
      }, function(entityB) {
        return entityB instanceof Wall || entityB instanceof Ball;
      }, function(rocket, wallOrBall) {
        game.addEntity(rocket.explode());
      })
      // explosions push balls
      .addHandler(function(entityA) {
        return entityA instanceof Explosion;
      }, function(entityB) {
        return entityB instanceof Ball;
      }, function(explosion, ball) {
        explosion.pushBall(ball);
      })
      // game over when ball hits floor
      .addHandler(function(entityA) {
        return entityA instanceof Ball;
      }, function(entityB) {
        return entityB.isFloor;
      }, function(ball, floor) {
        // TODO activate game over sequence instead of this
        //game.changeState(gameplayState);
      });

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

    [
      new Ball(1024 / 2, 35, 50)
    ].forEach(game.addBall, game);

    var wallWidth = 20;
    var floorHeight = 20;
    var ceilingHeight = 20;
    var extraPadding = 500;

    // wall pieces
    var left = new Wall(0 - extraPadding, 0 + ceilingHeight, wallWidth + extraPadding, (768 - floorHeight) - ceilingHeight);
    var right = new Wall(1024 - wallWidth, 0, wallWidth + extraPadding, 768 - floorHeight);
    var ceiling = new Wall(0, 0 - extraPadding, 1024, ceilingHeight + extraPadding);
    var floor = new Wall(0, 768 - floorHeight, 1024, floorHeight + extraPadding);

    // flag that makes collision handling simpler
    floor.isFloor = true;

    [floor, left, right, ceiling].forEach(game.addWall, game);

    this.launcher = new Launcher();
    this.launcher.move(1024 / 2, 768 - 40);

    this.actualFps = new Text(40, 30, '');
    this.targetFps = new Text(40, 40, '');
    this.actualTickTime = new Text(40, 50, '');
    this.targetTickTime = new Text(40, 60, '');

    game.addEntity(this.actualFps);
    game.addEntity(this.targetFps);
    game.addEntity(this.actualTickTime);
    game.addEntity(this.targetTickTime);
  },
  update: function(game, input, tickEvent) {
    this.actualFps.message = createjs.Ticker.getMeasuredFPS();
    this.targetFps.message = createjs.Ticker.getFPS();
    this.actualTickTime.message = createjs.Ticker.getMeasuredTickTime();
    this.targetTickTime.message = createjs.Ticker.getInterval();

    this.launcher.aim(input.mouseLocation.x, input.mouseLocation.y);
    this.launcher.update(tickEvent);

    // react to input
    if (input.keys[16]) { // shift
      var rocket = this.launcher.fire();
      if (rocket) {
        game.addRocket(rocket);
      }
    }
  },
  tearDown: function(game) {

  }
};

module.exports = gameplayState;