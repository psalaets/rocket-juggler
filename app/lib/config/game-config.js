var defaults = {
  ballRadius: 50,
  ballMass: 1,
  rocketSpeed: 800,
  rocketRadius: 10,
  explosionBallPush: 800,
  explosionRadius: 70,
  explosionDuration: 100
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
  values: function() {
    return copy(values, {});
  },
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
