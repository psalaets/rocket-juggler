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
  }
};

configKeys.forEach(function(key) {
  viewModel[key] = ko.observable();
});

module.exports = {
  // apply incoming config object to view model
  updateViewModel: function(config) {
    configKeys.forEach(function(key) {
      viewModel[key](config[key]);
    });
  },
  viewModel: viewModel
};

function asNumber(str) {
  return parseInt(str, 10);
};
