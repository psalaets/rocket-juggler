module.exports = function() {
  var index = 0;

  var locations = [
    {x: 656, y: -100},
    {x: 328, y: -100}
  ];

  var velocities = [
    {x: -100, y: 80},
    {x: 100, y: 70},
    {x: -70, y: 60},
    {x: 50, y: 80}
  ];

  return {
    nextConfig: function() {
      index += 1;
      var location = locations[index % locations.length];
      var velocity = velocities[index % velocities.length];

      return function(ball) {
        ball.moveTo(location.x, location.y);
        ball.setVelocity(velocity.x, velocity.y);
      };
    }
  };
};
