var assert = require('assert');
var createCollisionHandler = require('../app/lib/collision-handler');

describe('collision handler', function() {
  var collisionHandler;

  beforeEach(function() {
    collisionHandler = createCollisionHandler();
  });

  it('can chain #addHandler calls', function() {
    var fn = function() {};

    var addHandlerResult = collisionHandler.addHandler(fn, fn, fn);

    assert.strictEqual(addHandlerResult, collisionHandler);
  });

  describe('#handleCollision', function () {
    function testA(entity) {
      return entity.id == 'A';
    }

    function testB(entity) {
      return entity.id == 'B';
    }

    var entityA = {id: 'A'};
    var entityB = {id: 'B'};
    var entityC = {id: 'C'};

    it('invokes handler function when both entity tests pass', function() {
      var fires = 0;
      collisionHandler.addHandler(testA, testB, function(a, b) {
        assert.strictEqual(a, entityA);
        assert.strictEqual(b, entityB);

        fires += 1;
      });

      collisionHandler.handleCollision(entityA, entityB);

      assert.equal(fires, 1);
    });

    it('doesn\'t invoke handler function when any entity test does not pass', function() {
      var fires = 0;
      collisionHandler.addHandler(testA, testB, function(a, b) {
        fires += 1;
      });

      collisionHandler.handleCollision(entityA, entityC);

      assert.equal(fires, 0);
    });

    it('runs handler no matter the order of the entities', function() {
      var fires = 0;
      collisionHandler.addHandler(testA, testB, function(a, b) {
        assert.strictEqual(a, entityA);
        assert.strictEqual(b, entityB);

        fires += 1;
      });

      // entities order is flipped but handler still runs as usual
      collisionHandler.handleCollision(entityB, entityA);

      assert.equal(fires, 1);
    });

    it('runs first matching handler when more than one handler matches', function() {
      var fires = 0;
      collisionHandler.addHandler(testA, testB, function(a, b) {
        fires += 1;
      });

      collisionHandler.addHandler(testA, testB, function(a, b) {
        assert.fail(null, null, 'this should not run');
      });

      collisionHandler.handleCollision(entityA, entityB);

      assert.equal(fires, 1);
    });
  });
});
