var document = require('window').document;
var canvas = document.getElementById('stage');

var Game = require('./lib/game');

var game = new Game(canvas);

game.defineState('title', require('./lib/state/title'));
game.defineState('gameplay', require('./lib/state/gameplay'));

game.changeState('title');
game.start();
