var document = require('window').document;

// load config and apply it to game
var configPersistence = require('./lib/config/persistence');
var gameConfig = require('./lib/config/game-config');
gameConfig.apply(configPersistence.load());

// create game
var Game = require('./lib/game');
var canvas = document.getElementById('stage');
var game = new Game(canvas);

var loader = require('./lib/loader');
// gameplay state
loader.loadImage('torso',               'assets/torso.png');
loader.loadImage('legs',                'assets/legs.png');
loader.loadImage('background',          'assets/background.png');
loader.loadImage('rocket',              'assets/rocket.png');
loader.loadImage('meteor',              'assets/meteor.png');
// title state
loader.loadImage('about-button',        'assets/aboutbutton.png');
loader.loadImage('about-button-hover',  'assets/aboutbuttonhover.png');
loader.loadImage('play-button',         'assets/playbutton.png');
loader.loadImage('play-button-hover',   'assets/playbuttonhover.png');
loader.loadImage('title-screen',        'assets/withoutbuttons.png');
loader.loadImage('insert-coin',         'assets/insertcoin.png');

var makeLoadingState = require('./lib/state/loading');
game.defineState('loading', makeLoadingState(loader));

game.defineState('title', require('./lib/state/title'));
game.defineState('gameplay', require('./lib/state/gameplay'));

game.changeState('loading');
game.start();