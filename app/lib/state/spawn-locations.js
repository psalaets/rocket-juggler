module.exports = function() {
  var index = 0;
  var locations = [
    {x: 656, y: 80},
    {x: 328, y: 80}
  ];

  return {
    nextLocation: function() {
      var location = locations[index];

      index += 1;
      if (index == locations.length) {
        index = 0;
      }

      return location;
    }
  }
};
