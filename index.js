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
var extraPadding = 500;

var walls = [
  // left
  createWall(0 - extraPadding, 0 + ceilingHeight, wallWidth + extraPadding, (768 - floorHeight) - ceilingHeight),
  // right
  createWall(1024 - wallWidth, 0, wallWidth + extraPadding, 768 - floorHeight),
  // floor
  createWall(0, 768 - floorHeight, 1024, floorHeight + extraPadding),
  // ceiling
  createWall(0, 0 - extraPadding, 1024, ceilingHeight + extraPadding)
];

var aimLine = new createjs.Shape();
stage.addChild(aimLine);

var objects = [];
objects.push.apply(objects, balls);
objects.push.apply(objects, walls);

createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener('tick', function(event) {

  aimLine.graphics
    .clear()
    .beginStroke('#00ff00')
    .setStrokeStyle(5)
    .moveTo(1024 / 2, 768 - floorHeight)
    .lineTo(stage.mouseX, stage.mouseY);

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
