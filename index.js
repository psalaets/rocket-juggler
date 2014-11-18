var document = require('window').document;
var canvas = document.getElementById('stage');

var Game = require('./lib/game');
var gameplay = require('./lib/gameplay');
var title = require('./lib/title');

var game = new Game(canvas);
game.changeState(title);

game.start();
