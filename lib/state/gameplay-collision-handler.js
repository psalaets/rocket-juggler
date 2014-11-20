var Ball = require('../entity/ball');
var Wall = require('../entity/wall');
var Rocket = require('../entity/rocket');
var Explosion = require('../entity/explosion');
var createCollisionHandler = require('../collision-handler');

function isFrom(constructorFn) {
  return function isEntityFrom(entity) {
    return entity instanceof constructorFn;
  };
}

module.exports = function(game, gameplayState) {
  var collisionHandler = createCollisionHandler();

  collisionHandler
    // rockets explode on walls
    .addHandler(
      isFrom(Rocket),
      isFrom(Wall),
      function(rocket, wall) {
        game.addEntity(rocket.explode());
      }
    )
    // rockets explode on balls
    .addHandler(
      isFrom(Rocket),
      isFrom(Ball),
      function(rocket, ball) {
        game.addEntity(rocket.explode());
      }
    )
    // explosions push balls
    .addHandler(
      isFrom(Explosion),
      isFrom(Ball),
      function(explosion, ball) {
        explosion.pushBall(ball);
      }
    )
    // game over when ball hits floor
    .addHandler(
      isFrom(Ball),
      function(entityB) {
        return entityB.isFloor;
      },
      function(ball, floor) {
        game.changeState('title', gameplayState.score);
      }
    );

  return collisionHandler;
};
