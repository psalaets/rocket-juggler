var document = require('window').document;
var canvas = document.getElementById('stage');
var ko = require('knockout');

// get config set up

var configPanel = require('./lib/config/config-panel');
var config = require('./lib/config');

ko.applyBindings(configPanel.viewModel);

// loadConfig(default) - apply current config to vm and game config

configPanel.updateViewModel(config);

// create and start game

var Game = require('./lib/game');
var game = new Game(canvas);

game.defineState('title', require('./lib/state/title'));
game.defineState('gameplay', require('./lib/state/gameplay'));

game.changeState('title');
game.start();
