var createjs = require('createjs');
var document = require('window').document;

var canvas = document.getElementById('stage');
var stage = new createjs.Stage(canvas);

var p2 = require('p2');

var Ball = require('./lib/ball');
var Wall = require('./lib/wall');

var world = new p2.World({
  gravity: [0, 293]
});

var balls = [
  createBall(205, 200, 20),
  createBall(200, 100, 20),
  createBall(600, 100, 5),
  createBall(300, 100, 20)
];

var wallWidth = 20;
var floorHeight = 20;
var ceilingHeight = 20;

var walls = [
  // left
  createWall(0, 0 + ceilingHeight, wallWidth, (768 - floorHeight) - ceilingHeight),
  // right
  createWall(1024 - wallWidth, 0, wallWidth, 768 - floorHeight),
  // floor
  createWall(0, 768 - floorHeight, 1024, floorHeight),
  // ceiling
  createWall(0, 0, 1024, ceilingHeight)
];

var objects = [];
objects.push.apply(objects, balls);
objects.push.apply(objects, walls);

createjs.Ticker.setFPS(60);
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
