var ghostBody = require('ghost-body');

var Ball = require('../entity/ball');
var Wall = require('../entity/wall');
var Rocket = require('../entity/rocket');
var Launcher = require('../launcher');

var gameplayState = {
  setUp: function(game) {
    game.createWorld(function(world) {
      ghostBody.enable(world);

      world.gravity = [0, 293];

      world.on('beginContact', function(event) {
        var bodyA = event.bodyA;
        var bodyB = event.bodyB;

        var entityA = game.getEntityByBody(bodyA);
        var entityB = game.getEntityByBody(bodyB);

        if (entityA instanceof Rocket) {
          // TODO spawn explosion
          game.removeEntity(entityA);
        }

        if (entityB instanceof Rocket) {
          // TODO spawn explosion
          game.removeEntity(entityB);
        }
      });
    });

    [
      new Ball(205, 200, 30)
    ].forEach(game.addBall, game);

    var wallWidth = 20;
    var floorHeight = 20;
    var ceilingHeight = 20;
    var extraPadding = 500;

    // wall pieces
    var floor, left, right, ceiling;

    floor = new Wall(0, 768 - floorHeight, 1024, floorHeight + extraPadding);
    left = new Wall(0 - extraPadding, 0 + ceilingHeight, wallWidth + extraPadding, (768 - floorHeight) - ceilingHeight);
    right = new Wall(1024 - wallWidth, 0, wallWidth + extraPadding, 768 - floorHeight);
    ceiling = new Wall(0, 0 - extraPadding, 1024, ceilingHeight + extraPadding);

    [floor, left, right, ceiling].forEach(game.addWall, game);

    this.launcher = new Launcher();
    this.launcher.move(1024 / 2, 768 - 40);
  },
  update: function(game, input, tickEvent) {
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