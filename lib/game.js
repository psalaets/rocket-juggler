var p2 = require('p2');
var createjs = require('createjs');
var document = require('window').document;

var timer = require('./ticker-countdown')();

module.exports = Game;

function Game(canvasElement) {
  this.stage = new createjs.Stage(canvasElement);

  this.entities = [];
  // hash of body id => entity for easier collision reactions
  this.entitiesByBodyId = {};

  this.timer = timer;

  // default to dummy state
  this.currentState = {
    setUp: function() {},
    update: function() {},
    tearDown: function() {}
  };

  // if set, game will switch to this state
  this.nextState = null;

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

p.getEntityByBody = function(body) {
  return this.entitiesByBodyId[body.id];
};

p.addEntity = function(entity) {
  if (entity.view) {
    this.stage.addChild(entity.view);
  }

  if (entity.body) {
    this.entitiesByBodyId[entity.body.id] = entity;

    if (this.world) {
      this.world.addBody(entity.body);
    } else {
      throw new Error('Cannot add physical entity until world has been created, see Game#createWorld')
    }
  }

  this.entities.push(entity);
};

// removes body and view only
p.removeEntity = function(entity) {
  if (entity.view) {
    this.stage.removeChild(entity.view);
  }

  if (entity.body) {
    this.world.removeBody(entity.body);

    delete this.entitiesByBodyId[entity.body.id];
  }
};

p.update = function(tickEvent) {
  // sync up game's view of mouse location
  this.input.mouseLocation.x = this.stage.mouseX;
  this.input.mouseLocation.y = this.stage.mouseY;

  // update physics
  if (this.world) {
    //this.world.step(tickEvent.delta / 1000);
    this.world.step(2 / 60);
  }

  // update entities
  for (var i = 0; i < this.entities.length; i++) {
    this.entities[i].update && this.entities[i].update(tickEvent);
  }

  this.currentState.update(this, this.input, tickEvent);

  // clear out inactive entities
  for (i = 0; i < this.entities.length; i++) {
    if (this.entities[i].inactive) {
      this.removeEntity(this.entities[i]);
    }
  }
  this.entities = this.entities.filter(function(entity) {
    return !entity.inactive;
  });

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
  this.entitiesByBodyId = {};
};

p.start = function() {
  var self = this;

  createjs.Ticker.setFPS(30);

  createjs.Ticker.on('tick', this.timer);
  createjs.Ticker.on('tick', function(tickEvent) {
    self.update(tickEvent);
  });
};
