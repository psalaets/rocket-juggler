module.exports = createTimer;

function createTimer() {
  var countdowns = [];

  var timer = function(tickEvent) {
    // iterate over copy of countdowns in case a callback adds more countdowns
    var countdownsCopy = countdowns.slice();

    // decrement each countdown and run callback if expired
    countdownsCopy.forEach(function(countdown) {
      countdown.timeLeft -= tickEvent.delta;

      if (countdown.timeLeft <= 0) {
        countdown.callback();
      }
    });

    // remove expired countdowns
    countdowns = countdowns.filter(function(countdown) {
      return countdown.timeLeft > 0;
    });
  };

  timer.addCountdown = function(time, fn) {
    countdowns.push({
      timeLeft: time,
      callback: fn
    });
  };

  timer.clearCountdowns = function() {
    countdowns = [];
  };

  return timer;
}
