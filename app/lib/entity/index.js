var gameConfig = require('../config/game-config');

var Ball = require('./ball');
var Wall = require('./wall');
var Explosion = require('./explosion');
var Rocket = require('./rocket');
var Text = require('./text');

module.exports = {
  rocket: function(x, y) {
    var rocket = new Rocket(x, y, gameConfig.rocketRadius);
    rocket.speed = gameConfig.rocketSpeed;
    return rocket;
  },
  ball: function(x, y) {
    var ball = new Ball(x, y, gameConfig.ballRadius);
    ball.body.mass = gameConfig.ballMass;
    return ball;
  },
  wall: function(top, left, width, height) {
    return new Wall(top, left, width, height);
  },
  explosion: function(x, y) {
    var explosion = new Explosion(x, y, gameConfig.explosionRadius);
    explosion.ballPush = gameConfig.explosionBallPush;
    explosion.timeLeft = gameConfig.explosionDuration;
    return explosion;
  },
  text: function(x, y, message) {
    return new Text(x, y, message);
  }
};
