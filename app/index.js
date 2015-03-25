var document = require('window').document;

// load config and apply it to game
var configPersistence = require('./lib/config/persistence');
var gameConfig = require('./lib/config/game-config');
gameConfig.apply(configPersistence.load());

// create and start game
var Game = require('./lib/game');

var canvas = document.getElementById('stage');
var game = new Game(canvas);

game.defineState('title', require('./lib/state/title'));
game.defineState('help', require('./lib/state/help'));
game.defineState('gameplay', require('./lib/state/gameplay'));

game.changeState('title');
game.start();
