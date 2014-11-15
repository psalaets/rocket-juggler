var createjs = require('createjs');
var document = require('window').document;

var canvas = document.getElementById('stage');
var stage = new createjs.Stage(canvas);

var p2 = require('p2');

var Ball = require('./lib/ball');


var world = new p2.World({
  gravity: [5, 180]
});

var objects = [];

objects.push(createBall(10, 10, 20));
objects.push(createBall(100, 100, 50));
objects.push(createBall(200, 200, 5));

createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener('tick', function(event) {

  world.step(event.delta / 1000)

  for (var i = 0; i < objects.length; i++) {
    objects[i].update && objects[i].update(event);
  }

  stage.update();
});

function createBall(x, y, radius) {
  var ball = new Ball(x, y, radius);

  stage.addChild(ball);
  world.addBody(ball.body);

  return ball;
}