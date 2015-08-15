var createjs = require('createjs');
var p2 = require('p2');
var ghostBody = require('ghost-body');
var Vec2 = require('vec2');

var loader = require('../loader');

module.exports = Explosion;

function Explosion(x, y, radius) {
  this.view = createView(radius);
  this.view.x = x;
  this.view.y = y;

  this.body = createBody(x, y, radius);

  // how many ms an explosion lasts
  this.timeLeft = 900;
  this.pushTimeLeft = 100;

  this.ballPush = 800;

  // remember what balls have been hit so they aren't hit 2+ times
  this.alreadyHit = [];
}

function createView(radius) {
  if (!Explosion.spriteSheet) {
    Explosion.spriteSheet = new createjs.SpriteSheet({
      images: [loader.get('explosion')],
      frames: [
        // x, y, width, height, imageIndex*, regX*, regY*
        [1,   1,   70, 70, 0, 35, 35], // 0
        [74,  1,   70, 70, 0, 35, 35], // 1
        [147, 1,   70, 70, 0, 35, 35], // 2
        [220, 1,   70, 70, 0, 35, 35], // 3
        [1,   74,  70, 70, 0, 35, 35], // 4
        [74,  74,  70, 70, 0, 35, 35], // 5
        [147, 74,  70, 70, 0, 35, 35], // 6
        [220, 74,  70, 70, 0, 35, 35], // 7
        [1,   147, 70, 70, 0, 35, 35]  // 8
      ],
      animations: {
        explode: {
          frames: [
            0, 1, 2,
            3, 3,
            4, 4, 4,
            5, 5, 5, 5,
            6, 6, 6, 6, 6,
            7, 7, 7, 7, 7,
            8, 8, 8, 8, 8
          ]
        }
      },
      speed: 4
    });
  }

  var sprite = new createjs.Sprite(Explosion.spriteSheet, 'explode');
  return sprite;
}

function createBody(x, y, radius) {
  var body = new p2.Body({
    mass: 1,
    position: [x, y]
  });

  // not affected by gravity
  body.gravityScale = 0;

  // doesn't spin
  body.fixedRotation = true;

  // doesn't hit stuff but overlaps still detected
  ghostBody.ghostify(body);

  body.addShape(new p2.Circle(radius));
  return body;
}

var p = Explosion.prototype;

p.update = function(tickEvent) {
  // place shape at body's position
  this.view.x = this.body.position[0];
  this.view.y = this.body.position[1];

  if (this.timeLeft <= 0) {
    this.inactive = true;
  }

  this.timeLeft -= tickEvent.delta;
  this.pushTimeLeft -= tickEvent.delta;
};

p.pushBall = function(ball) {
  if (this.pushTimeLeft > 0 && ball.fairGame && this.alreadyHit.indexOf(ball) == -1) {
    this.alreadyHit.push(ball);

    var pushVector = new Vec2(ball.body.position[0], ball.body.position[1]);
    pushVector.subtract(this.body.position[0], this.body.position[1]);
    pushVector.normalize();

    pushVector.multiply(this.ballPush);

    var ballVelocity = ball.body.velocity;
    ballVelocity[0] += pushVector.x;
    ballVelocity[1] += pushVector.y;
  }
};
