var assert = require('assert');
var createTimer = require('../app/lib/ticker-countdown');

describe('ticker', function() {
  var ticker;

  beforeEach(function() {
    ticker = createTimer();
  });

  it('is a function that takes a tick event', function() {
    assert(typeof ticker == 'function');
    assert.equal(ticker.length, 1);
  });

  it('runs function once, synchronously when enough millis have passed', function() {
    var fires = 0;
    ticker.addCountdown(1000, function() {
      fires += 1;
    });

    ticker(tickEvent(1000));

    assert.equal(fires, 1);

    ticker(tickEvent(1000));
    ticker(tickEvent(1000));

    assert.equal(fires, 1); // hasn't fired again
  });

  it('doesn\'t run function if not enough time has elapsed', function() {
    var fires = 0;
    ticker.addCountdown(1000, function() {
      fires += 1;
    });

    ticker(tickEvent(500));

    assert.equal(fires, 0);
  });

  it('doesn\'t run function for countdowns that have been cleared', function() {
    var fires = 0;
    ticker.addCountdown(1000, function() {
      fires += 1;
    });

    ticker.clearCountdowns();
    ticker(tickEvent(2000));

    assert.equal(fires, 0);
  });
});

function tickEvent(delta) {
  return {
    delta: delta
  };
}
