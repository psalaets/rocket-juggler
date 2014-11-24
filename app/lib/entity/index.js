var config = require('../config');

var Ball = require('./ball');
var Wall = require('./wall');
var Explosion = require('./explosion');
var Rocket = require('./rocket');
var Text = require('./text');

module.exports = {
  rocket: function(x, y) {
    var rocket = new Rocket(x, y, config.rocketRadius);
    rocket.speed = config.rocketSpeed;
    return rocket;
  },
  ball: function(x, y) {
    var ball = new Ball(x, y, config.ballRadius);
    ball.body.mass = config.ballMass;
    return ball;
  },
  wall: function(top, left, width, height) {
    return new Wall(top, left, width, height);
  },
  explosion: function(x, y) {
    var explosion = new Explosion(x, y, config.explosionRadius);
    explosion.ballPush = config.explosionBallPush;
    explosion.timeLeft = config.explosionDuration;
    return explosion;
  },
  text: function(x, y, message) {
    return new Text(x, y, message);
  }
};
