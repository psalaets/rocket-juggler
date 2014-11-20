# Entity

Entity is an object with any of (everything optional)

- view property which is an easeljs DisplayObject
- body property which is a p2 Body
- update function which is given tickEvent from createjs.Ticker's tick event
- inactive property, if truthy the entity will be removed from game

# Game State

Game state is an object that has (all required)

- setUp function that takes a Game object
- update function that takes Game, input object, tick event
- tearDown function that takes a Game object
