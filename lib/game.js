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

  // game states by name
  this.states = {
    dummy: {
      setUp: function(game) {},
      update: function(game, input, tickEvent) {},
      tearDown: function(game) {}
    }
  };

  // default to dummy state
  this.currentState = this.states.dummy;

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

p.defineState = function(name, state) {
  this.states[name] = state;
};

p.createWorld = function(callback) {
  this.world = new p2.World();
  callback(this.world);
};

p.addBall = function(ball) {
  this.ballCount = this.ballCount || 0;
  this.ballCount += 1;

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

p.removeBodyOf = function(entity) {
  if (entity.body) {
    this.world.removeBody(entity.body);

    delete this.entitiesByBodyId[entity.body.id];
  }
};

p.removeViewOf = function(entity) {
  if (entity.view) {
    this.stage.removeChild(entity.view);
  }
};

p.update = function(tickEvent) {
  // sync up game's view of mouse location
  this.input.mouseLocation.x = this.stage.mouseX;
  this.input.mouseLocation.y = this.stage.mouseY;

  // update physics
  if (this.world) {
    //this.world.step(tickEvent.delta / 1000);
    this.world.step(1 / 40);
  }

  // update entities
  for (var i = 0; i < this.entities.length; i++) {
    this.entities[i].update && this.entities[i].update(tickEvent);
  }

  this.currentState.update(this, this.input, tickEvent);

  // clear out inactive entities
  for (i = 0; i < this.entities.length; i++) {
    if (this.entities[i].inactive) {
      this.removeBodyOf(this.entities[i]);
      this.removeViewOf(this.entities[i]);
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
p.changeState = function(stateName) {
  var nextState = this.states[stateName];

  if (nextState) {
    this.nextState = nextState;
  } else {
    throw new Error('No such state "' + stateName + '". Known states are ' +
      Object.keys(this.states).sort());
  }
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

  createjs.Ticker.setFPS(40);

  createjs.Ticker.on('tick', this.timer);
  createjs.Ticker.on('tick', function(tickEvent) {
    self.update(tickEvent);
  });
};
