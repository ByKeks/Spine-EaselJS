Spine-EaselJS
=============

Rendering a Spine animation with EaselJS

## Spine Animation Example
```javascript

var stage = new createjs.Stage('myCanvas');
var dragon = new createjs.Spine("res/sceletons/dragon/dragon.atlas", "res/sceletons/dragon/dragon.json");
dragon.setTransform(300, 220, 0.5, 0.5);
dragon.onComplete = function(){
  console.log(dragon);
  dragon.state.setAnimationByName(0, 'flying', true);
  stage.addChild(dragon);
}
stage.addChild(dragon);
createjs.Ticker.on("tick", function(e){
  dragon.update(e);
  stage.update();
})

```