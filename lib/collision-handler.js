module.exports = createCollisionHandler;

var methods = {
  initialize: function() {
    this.handlerTuples = [];
  },
  addHandler: function(entityATest, entityBTest, handler) {
    this.handlerTuples.push({
      entityATest: entityATest,
      entityBTest: entityBTest,
      handler: handler
    },
    // handle reverse case as well
    {
      entityATest: entityBTest,
      entityBTest: entityATest,
      handler: flipEntities(handler)
    });

    return this;
  },
  handleCollision: function(entityA, entityB) {
    // find tuples that can handle this entity pair
    var matchingTuples = this.handlerTuples.filter(function(tuple) {
      return tuple.entityATest(entityA) && tuple.entityBTest(entityB);
    });

    // if any, run the first one
    if (matchingTuples.length) {
      matchingTuples[0].handler(entityA, entityB);
    }
  }
};

function flipEntities(handler) {
  return function(entityA, entityB) {
    return handler.call(null, entityB, entityA);
  }
}

function createCollisionHandler() {
  var handler = Object.create(methods);
  handler.initialize();
  return handler;
}
