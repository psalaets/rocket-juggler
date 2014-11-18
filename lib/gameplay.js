var Ball = require('./ball');
var Wall = require('./wall');
var Launcher = require('./launcher');

var gameplayState = {
  setUp: function(game) {
    [
      new Ball(205, 200, 20),
      new Ball(200, 100, 20),
      new Ball(600, 100, 5),
      new Ball(300, 100, 20)
    ].forEach(function(ball) {
      game.addBall(ball);
    });

    var wallWidth = 20;
    var floorHeight = 20;
    var ceilingHeight = 20;
    var extraPadding = 500;

    [
      // left
      new Wall(0 - extraPadding, 0 + ceilingHeight, wallWidth + extraPadding, (768 - floorHeight) - ceilingHeight),
      // right
      new Wall(1024 - wallWidth, 0, wallWidth + extraPadding, 768 - floorHeight),
      // floor
      new Wall(0, 768 - floorHeight, 1024, floorHeight + extraPadding),
      // ceiling
      new Wall(0, 0 - extraPadding, 1024, ceilingHeight + extraPadding)
    ].forEach(function(wall) {
      game.addWall(wall);
    });

    this.launcher = new Launcher();
    this.launcher.move(1024 / 2, 768 - 40);
  },
  update: function(game, tickEvent) {
    var input = game.input;

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