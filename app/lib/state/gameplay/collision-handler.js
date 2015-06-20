var Ball = require('../../entity/ball');
var Wall = require('../../entity/wall');
var Rocket = require('../../entity/rocket');
var Explosion = require('../../entity/explosion');
var createCollisionHandler = require('../../collision-handler');
var entities = require('../../entity');

module.exports = function(game, gameplayState) {
  var collisionHandler = createCollisionHandler();

  collisionHandler
    // rockets explode on walls
    .addHandler(
      isFrom(Rocket),
      isFrom(Wall),
      function(rocket, wall) {
        game.addEntity(explode(rocket));
      }
    )
    // rockets explode on balls
    .addHandler(
      isFrom(Rocket),
      isFrom(Ball),
      function(rocket, ball) {
        game.addEntity(explode(rocket));
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
        // temporarily off for debug purposes
        //game.changeState('title', gameplayState.score);
      }
    );

  return collisionHandler;
};

function isFrom(constructorFn) {
  return function isEntityFrom(entity) {
    return entity instanceof constructorFn;
  };
}

function explode(rocket) {
  rocket.inactive = true;
  return entities.explosion(rocket.x, rocket.y);
}
