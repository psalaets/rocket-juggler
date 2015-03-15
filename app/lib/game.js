var p2 = require('p2');
var createjs = require('createjs');

var timer = require('./ticker-countdown')();
var input = require('./input');

module.exports = Game;

function Game(canvasElement) {
  this.stage = new createjs.Stage(canvasElement);
  this.width = canvasElement.width;
  this.height = canvasElement.height;

  this.desiredFps = 30;

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

  // holds next game state and any params passed to it
  this.nextStateInfo = null;

  this.input = input;
}

var p = Game.prototype;

p.defineState = function(name, state) {
  state.init(this);
  this.states[name] = state;
};

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
  this.input.updateMouseLocation(this.stage.mouseX, this.stage.mouseY);

  // update physics
  if (this.world) {
    var maxSubSteps = 3;
    this.world.step(1 / this.desiredFps, tickEvent.delta, maxSubSteps);
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

// give a state access to the game's easeljs stage
// (mostly for setting up mouse listeners)
p.withStage = function(fn) {
  fn(this.stage);
};

// switch game state at next available moment
p.changeState = function(stateName) {
  var paramsToNextState = Array.prototype.slice.call(arguments, 1);
  var nextState = this.states[stateName];

  if (nextState) {
    this.nextStateInfo = {
      state: nextState,
      params: paramsToNextState
    };
  } else {
    throw new Error('No such state "' + stateName + '". Known states are ' +
      Object.keys(this.states).sort());
  }
};

p.stateChangeRequested = function() {
  return this.nextStateInfo;
};

p.changeToNextState = function() {
  this.currentState.tearDown(this);

  this.currentState = this.nextStateInfo.state;
  var params = this.nextStateInfo.params;
  // game is always first param to setUp
  params.unshift(this);

  delete this.nextStateInfo;

  this.reset();

  this.currentState.setUp.apply(this.currentState, params);
};

p.reset = function() {
  // clear stage
  this.stage.removeAllChildren();

  // clear world then remove world
  if (this.world) {
    this.world.clear();
    delete this.world;
  }

  this.entities = [];
  this.entitiesByBodyId = {};

  // remove all input related listeners from stage
  [
    'click',
    'dblclick',
    'drawend',
    'drawstart',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mouseout',
    'mouseover',
    'pressmove',
    'pressup',
    'rollout',
    'rollover',
    'stagemousedown',
    'stagemousemove',
    'stagemouseup'
  ].forEach(this.stage.removeAllEventListeners, this.stage);
};

p.start = function() {
  var self = this;

  createjs.Ticker.setFPS(this.desiredFps);

  createjs.Ticker.on('tick', this.timer);
  createjs.Ticker.on('tick', function(tickEvent) {
    self.update(tickEvent);
  });
};
