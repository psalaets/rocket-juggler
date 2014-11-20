# Entities

Entity is an object with any of (everything optional)

- view property which is an easeljs DisplayObject
- body property which is a p2 Body
- update function which is given tickEvent from createjs.Ticker's tick event
- inactive property, if truthy the entity will be removed from game