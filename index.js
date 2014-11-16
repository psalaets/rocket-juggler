var createjs = require('createjs');
var document = require('window').document;

var canvas = document.getElementById('stage');
var stage = new createjs.Stage(canvas);

var p2 = require('p2');
var Vec2 = require('vec2');

var Ball = require('./lib/ball');
var Wall = require('./lib/wall');
var Rocket = require('./lib/rocket');

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

var keys = {};

document.onkeydown = function onKeyDown(event) {
  keys[event.keyCode] = true;
};

document.onkeyup = function onKeyUp(event) {
  delete keys[event.keyCode];
};

var anchor = {
  x: 1024 / 2,
  y: 768 - floorHeight - 20
}

var aimLine = new createjs.Shape();
stage.addChild(aimLine);

var objects = [];
objects.push.apply(objects, balls);
objects.push.apply(objects, walls);

var fireDelay = 300;
var lastFireTime;

createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener('tick', function(event) {
  var now = event.time;

  if (keys[16]) { // shift
    if (!lastFireTime || now > lastFireTime + fireDelay) {
      var aimVector = new Vec2(stage.mouseX, stage.mouseY);
      aimVector.subtract(anchor.x, anchor.y);
      aimVector.normalize();

      objects.push(createRocket(anchor.x, anchor.y, aimVector));

      lastFireTime = now;
    }
  }

  aimLine.graphics
    .clear()
    .beginStroke('#00ff00')
    .setStrokeStyle(5)
    .moveTo(anchor.x, anchor.y)
    .lineTo(stage.mouseX, stage.mouseY);

  world.step(event.delta / 1000)

  for (var i = 0; i < objects.length; i++) {
    objects[i].update && objects[i].update(event);
  }

  stage.update();
});

function createBall(x, y, radius) {
  var ball = new Ball(x, y, radius);
  return addEntity(ball);
}

function createWall(x, y, width, height) {
  var wall = new Wall(x, y, width, height);
  return addEntity(wall);
}

function createRocket(x, y, aimVector) {
  var rocket = new Rocket(x, y);
  addEntity(rocket);

  var speed = 500;
  aimVector.multiply(speed);
  rocket.body.velocity = [aimVector.x, aimVector.y];

  return rocket;
}

function addEntity(entity) {
  stage.addChild(entity);
  world.addBody(entity.body);

  return entity;
}
