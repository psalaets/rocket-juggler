module.exports = function() {
  var index = 0;

  var locations = [
    {x: 656, y: -100},
    {x: 328, y: -100}
  ];

  var velocities = [
    {x: 0, y: 60},
    {x: 40, y: 70},
    {x: -20, y: 60},
    {x: 20, y: 70}
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
