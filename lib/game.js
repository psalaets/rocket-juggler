var p2 = require('p2');
var createjs = require('createjs');
var document = require('window').document;

var Launcher = require('./launcher');

module.exports = Game;

function Game(canvasElement) {
  this.stage = new createjs.Stage(canvasElement);

  this.world = new p2.World({
    gravity: [0, 293]
  });

  this.launcher = new Launcher();
  this.launcher.move(1024 / 2, 768 - 40);

  this.entities = [];

  this.input = {
    keys: {},
    mouseLocation: {
      x: 0,
      y: 0
    }
  };

  document.onkeydown = function(event) {
    this.input.keys[event.keyCode] = true;
  }.bind(this);

  document.onkeyup = function(event) {
    delete this.input.keys[event.keyCode];
  }.bind(this);
}

var p = Game.prototype;

p.addBall = function(ball) {
  this.addEntity(ball);
};

p.addWall = function(wall) {
  this.addEntity(wall);
};

p.addRocket = function(rocket) {
  this.addEntity(rocket);
};

p.addEntity = function(entity) {
  this.stage.addChild(entity.view);
  this.world.addBody(entity.body);

  this.entities.push(entity);
};

p.update = function(tickEvent) {
  // sync up game's view of mouse location
  this.input.mouseLocation.x = this.stage.mouseX;
  this.input.mouseLocation.y = this.stage.mouseY;

  this.launcher.aim(this.input.mouseLocation.x, this.input.mouseLocation.y);
  this.launcher.update(tickEvent);

  // react to input
  if (this.input.keys[16]) { // shift
    var rocket = this.launcher.fire();
    if (rocket) {
      this.addEntity(rocket);
    }
  }

  // update physics
  this.world.step(tickEvent.delta / 1000)

  // update entities
  for (var i = 0; i < this.entities.length; i++) {
    this.entities[i].update && this.entities[i].update(tickEvent);
  }

  // update visuals
  this.stage.update();
};

p.start = function() {
  var self = this;

  createjs.Ticker.setFPS(60);
  createjs.Ticker.on('tick', function(tickEvent) {
    self.update(tickEvent);
  });
};
