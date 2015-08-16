var createjs = require('createjs');

createjs.EventDispatcher.initialize(Loader.prototype);

function Loader() {
  this.queue = new createjs.LoadQueue();
  this.queue.setMaxConnections(10);

  this.queue.on('complete', function() {
    this.dispatchEvent('ready');
  }, this);

  this.queue.on('progress', function(event) {
    var progressEvent = new createjs.Event('progress');
    progressEvent.percent = Math.floor(event.loaded * 100);

    this.dispatchEvent(progressEvent);
  }, this);
}

var p = Loader.prototype;

p.loadImage = function(name, url) {
  this.queue.loadFile({
    id: name,
    src: url,
    type: createjs.AbstractLoader.IMAGE
  });
};

p.get = function(name) {
  if (!this.queue.loaded) {
    throw new Error('resource are not finished loading');
  }

  var resource = this.queue.getResult(name);

  if (!resource) {
    throw new Error(name + ' has not been requested to be loaded');
  }

  return resource;
};

module.exports = new Loader();
