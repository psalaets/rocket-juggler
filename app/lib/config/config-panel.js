var ko = require('knockout');

var gameConfig = require('./');

var configKeys = Object.keys(gameConfig);

var viewModel = {
  // apply view model's values to game config
  updateGame: function() {
    configKeys.forEach(function(key) {
      gameConfig[key] = this[key]();
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
