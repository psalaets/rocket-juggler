var createjs = require('createjs');
var p2 = require('p2');
var ghostBody = require('ghost-body');
var Vec2 = require('vec2');

module.exports = Explosion;

function Explosion(x, y, radius) {
  this.view = createView(radius);
  this.view.x = x;
  this.view.y = y;

  this.body = createBody(x, y, radius);

  // how many ms an explosion lasts
  this.timeLeft = 100;

  this.ballPush = 800;

  // remember what balls have been hit so they aren't hit 2+ times
  this.alreadyHit = [];
}

function createView(radius) {
  var g = new createjs.Graphics();

  // green outline
  g.beginStroke('#00ff00');
  g.drawCircle(0, 0, radius);

  return new createjs.Shape(g);
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
};

p.pushBall = function(ball) {
  if (this.alreadyHit.indexOf(ball) == -1) {
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
