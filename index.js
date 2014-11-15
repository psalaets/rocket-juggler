var createjs = require('createjs');
var document = require('window').document;

var canvas = document.getElementById('stage');
var stage = new createjs.Stage(canvas);

var p2 = require('p2');

var Ball = require('./lib/ball');
var Wall = require('./lib/wall');

var world = new p2.World({
  gravity: [0, 180]
});

var objects = [];

objects.push(createBall(100, 100, 20));
objects.push(createBall(200, 200, 50));
objects.push(createBall(303, 0, 50));
objects.push(createBall(300, 300, 50));

var wallWidth = 20;
var floorHeight = 20;

var left = createWall(0, 0, wallWidth, 768 - floorHeight);
var right = createWall(1024 - wallWidth, 0, wallWidth, 768 - floorHeight);
var floor = createWall(0, 768 - floorHeight, 1024, floorHeight);

objects.push(left, right, floor);

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

function createWall(x, y, width, height) {
  var wall = new Wall(x, y, width, height);

  stage.addChild(wall);
  world.addBody(wall.body);

  return wall;
}
