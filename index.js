var createjs = require('createjs');
var document = require('window').document;

var canvas = document.getElementById('stage');

var stage = new createjs.Stage(canvas);

var s = new createjs.Shape();
s.x = 100;
s.y = 100;

var g = s.graphics;
g.setStrokeStyle(1);
g.beginStroke(createjs.Graphics.getRGB(0,0,0));
g.beginFill(createjs.Graphics.getRGB(255,0,0));
g.drawCircle(0, 0, 20);

stage.addChild(s);

createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener('tick', function(event) {
  s.x = stage.mouseX;
  s.y = stage.mouseY;

  stage.update();
});
