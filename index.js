var document = require('window').document;
var canvas = document.getElementById('stage');

var Game = require('./lib/game');
var title = require('./lib/state/title');

var game = new Game(canvas);
game.changeState(title);

game.start();
