var ko = require('knockout');

var gameConfig = require('./game-config');

var configKeys = gameConfig.keys();

var viewModel = {
  // apply view model's values to game config
  updateGameConfig: function() {
    configKeys.forEach(function(key) {
      var rawValue = this[key]();
      gameConfig.set(key, asNumber(rawValue));
    }, this);
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
