var p2 = require('p2');
var createjs = require('createjs');
var document = require('window').document;

module.exports = Game;

function Game(canvasElement) {
  this.stage = new createjs.Stage(canvasElement);

  this.entities = [];

  this.input = {
    keys: {},
    mouseLocation: {
      x: 0,
      y: 0
    }
  };

  // default to dummy state
  this.currentState = {
    setUp: function() {},
    update: function() {},
    tearDown: function() {}
  };

  // if set, game will switch to this state
  this.nextState = null;

  document.onkeydown = function(event) {
    this.input.keys[event.keyCode] = true;
  }.bind(this);

  document.onkeyup = function(event) {
    delete this.input.keys[event.keyCode];
  }.bind(this);
}

var p = Game.prototype;

p.createWorld = function(callback) {
  this.world = new p2.World();
  callback(this.world);
};

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
  if (entity.view) {
    this.stage.addChild(entity.view);
  }

  if (entity.body) {
    if (this.world) {
      this.world.addBody(entity.body);
    } else {
      throw new Error('Cannot add physical entity until world has been created, see Game#createWorld')
    }
  }

  this.entities.push(entity);
};

p.update = function(tickEvent) {
  // sync up game's view of mouse location
  this.input.mouseLocation.x = this.stage.mouseX;
  this.input.mouseLocation.y = this.stage.mouseY;

  // update physics
  if (this.world) {
    this.world.step(tickEvent.delta / 1000);
  }

  // update entities
  for (var i = 0; i < this.entities.length; i++) {
    this.entities[i].update && this.entities[i].update(tickEvent);
  }

  this.currentState.update(this, this.input, tickEvent);

  // update visuals
  this.stage.update();

  if (this.stateChangeRequested()) {
    this.changeToNextState();
  }
};

// switch game state at next available moment
p.changeState = function(state) {
  this.nextState = state;
};

p.stateChangeRequested = function() {
  return this.nextState;
};

p.changeToNextState = function() {
  this.currentState.tearDown(this);

  this.currentState = this.nextState;
  delete this.nextState;

  this.reset();

  this.currentState.setUp(this);
};

p.reset = function() {
  // clear stage
  var views = this.stage.children.slice();
  views.forEach(this.stage.removeChild, this.stage);

  // clear world then remove world
  if (this.world) {
    var bodies = this.world.bodies.slice();
    bodies.forEach(this.world.removeBody, this.world);

    delete this.world;
  }

  this.entities = [];
};

p.start = function() {
  var self = this;

  createjs.Ticker.setFPS(60);
  createjs.Ticker.on('tick', function(tickEvent) {
    self.update(tickEvent);
  });
};
