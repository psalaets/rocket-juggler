var createjs = require('createjs');

var entities = require('../entity');
var loader = require('../loader');

module.exports = function(loader) {
  var loadingState = {
    init: function(game) {
      this.game = game;
    },
    setUp: function(game, score) {
      game.withStage(function(stage) {
        this.loadingText = new createjs.Text('', '20px Arial', '#FFFFFF');
        this.loadingText.x = 50;
        this.loadingText.y = 50;

        stage.addChild(this.loadingText);

        loader.on('progress', function(event) {
          this.loadingText.text = 'Loading... ' + event.percent + '%';
        }, this);

        loader.on('ready', function() {
          game.changeState('title');
        });
      }.bind(this));
    },
    update: function(game, input, tickEvent) {

    },
    tearDown: function(game) {

    }
  };

  return loadingState;
};