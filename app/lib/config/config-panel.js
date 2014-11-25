var ko = require('knockout');

var gameConfig = require('./game-config');
var configPersistence = require('./persistence');

var configKeys = gameConfig.keys();

var viewModel = {
  saveGameConfig: function() {
    // apply view model's values to game config
    configKeys.forEach(function(key) {
      var rawValue = this[key]();
      gameConfig.set(key, asNumber(rawValue));
    }, this);

    // and persist those values
    configPersistence.save(gameConfig.values());
  },
  restoreDefaults: function() {
    this.apply(gameConfig.defaultValues());
    this.saveGameConfig();
  },
  apply: function(config) {
    configKeys.forEach(function(key) {
      this[key](config[key]);
    }, this);
  }
};

configKeys.forEach(function(key) {
  viewModel[key] = ko.observable();
});

module.exports = {
  // apply incoming config object to view model
  updateViewModel: function(config) {
    this.viewModel.apply(config);
  },
  viewModel: viewModel
};

function asNumber(str) {
  return parseInt(str, 10);
};
