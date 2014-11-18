var document = require('window').document;
var canvas = document.getElementById('stage');

var Game = require('./lib/game');
var gameplay = require('./lib/gameplay');

var game = new Game(canvas);
game.setCurrentState(gameplay);

game.start();
