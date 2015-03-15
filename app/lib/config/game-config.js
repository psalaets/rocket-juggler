var defaults = {
  ballRadius: 50,
  ballMass: 0.25,
  ballSpawnDelay: 10000,
  rocketSpeed: 400,
  rocketRadius: 10,
  explosionBallPush: 400,
  explosionRadius: 70,
  explosionDuration: 100,
  playerSpeed: 200
};

var values = copy(defaults, {});

module.exports = {
  get: function(key) {
    return values[key];
  },
  set: function(key, value) {
    if (isConfigKey(key)) {
      values[key] = value;
    }
  },
  keys: function() {
    return Object.keys(defaults);
  },
  // bulk apply some config settings
  apply: function(config) {
    for (var key in config) {
      this.set(key, config[key]);
    }
  },
  // get copy of config settings
  values: function() {
    return copy(values, {});
  },
  // get copy of default config settings
  defaultValues: function() {
    return copy(defaults, {});
  }
};

function isConfigKey(key) {
  return key in defaults;
}

function copy(from, to) {
  for (var key in from) {
    to[key] = from[key];
  }
  return to;
}
