var localStorage = require('local-storage');

var defaultValues = require('./game-config').defaultValues();

module.exports = {
  load: function() {
    var configString = localStorage.getItem('config');
    if (configString) {
      return ensureAllValuesPopulated(JSON.parse(configString));
    } else {
      // save default config so there is something for next time
      this.save(defaultValues);
      return defaultValues;
    }
  },
  save: function(config) {
    localStorage.setItem('config', JSON.stringify(config));
  }
};

// make sure a property for every expected config value is there
function ensureAllValuesPopulated(config) {
  for (var key in defaultValues) {
    if (!(key in config)) {
      config[key] = defaultValues[key];
    }
  }
}
