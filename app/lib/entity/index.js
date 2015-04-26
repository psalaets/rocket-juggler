var gameConfig = require('../config/game-config');

var Ball = require('./ball');
var Wall = require('./wall');
var Explosion = require('./explosion');
var Rocket = require('./rocket');
var Text = require('./text');
var Player = require('./player');

module.exports = {
  rocket: function(x, y) {
    var rocket = new Rocket(x, y, gameConfig.get('rocketRadius'));
    rocket.speed = gameConfig.get('rocketSpeed');
    return rocket;
  },
  ball: function(x, y) {
    var ball = new Ball(x, y, gameConfig.get('ballRadius'));
    ball.body.mass = gameConfig.get('ballMass');
    return ball;
  },
  wall: function(left, top, width, height) {
    return new Wall(left, top, width, height);
  },
  explosion: function(x, y) {
    var explosion = new Explosion(x, y, gameConfig.get('explosionRadius'));
    explosion.ballPush = gameConfig.get('explosionBallPush');
    explosion.timeLeft = gameConfig.get('explosionDuration');
    return explosion;
  },
  text: function(x, y, message, color) {
    return new Text(x, y, message || '', color);
  },
  player: function(x, y) {
    return new Player(x, y);
  }
};
