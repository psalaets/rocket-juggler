var createjs = require('createjs');

var entities = require('../entity');
var loader = require('../loader');

module.exports = function(loader) {
  var loadingState = {
    init: function(game) {
      this.game = game;
    },
    setUp: function(game, score) {
      this.loadingText = entities.text(50, 50, '', '#000000');

      loader.on('progress', function(event) {
        this.loadingText.message = 'Loading ' + event.percent + '%';
      }, this);

      loader.on('ready', function() {
        game.changeState('title');
      });

      game.addEntity(this.loadingText);
    },
    update: function(game, input, tickEvent) {

    },
    tearDown: function(game) {

    }
  };

  return loadingState;
};