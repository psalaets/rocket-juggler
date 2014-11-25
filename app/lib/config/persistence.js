var localStorage = require('local-storage');

var gameConfig = require('./game-config');

module.exports = {
  load: function() {
    var configString = localStorage.getItem('config');
    if (configString) {
      return JSON.parse(configString);
    } else {
      // save default config so there is something for next time
      var defaults = gameConfig.defaultValues();
      this.save(defaults);
      return defaults;
    }
  },
  save: function(config) {
    localStorage.setItem('config', JSON.stringify(config));
  }
};
