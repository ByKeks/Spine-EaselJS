var Example;

Example = (function() {
  function Example() {
    this.canvas = document.getElementById("myCanvas");
    createjs.Ticker.setFPS(160);
    this.stats = new Stats();
    document.body.appendChild(this.stats.domElement);
    this.stats.domElement.style.position = "absolute";
    this.stats.domElement.style.top = "0px";
    this.stage = new createjs.Stage(this.canvas);
    this.stage.enableMouseOver(10);
    this.dragon = new createjs.Spine("res/sceletons/dragon/dragon.atlas", "res/sceletons/dragon/dragon.json");
    this.dragon.setTransform(300, 220, 0.5, 0.5);
    this.dragon.onComplete = (function(_this) {
      return function() {
        return _this.spineComplete(_this.dragon, 0);
      };
    })(this);
    this.ninja = new createjs.Spine("res/sceletons/ninja/speedy.atlas", "res/sceletons/ninja/speedy.json");
    this.ninja.setTransform(600, 180, 0.5, 0.5);
    this.ninja.onComplete = (function(_this) {
      return function() {
        return _this.spineComplete(_this.ninja, 1);
      };
    })(this);
    this.goblin = new createjs.Spine("res/sceletons/goblins/goblins.atlas", "res/sceletons/goblins/goblins.json");
    this.goblin.setTransform(600, 500, 1, 1);
    this.goblin.onComplete = (function(_this) {
      return function() {
        _this.goblin.setSkin('goblin');
        return _this.spineComplete(_this.goblin, 0);
      };
    })(this);
    this.powerup = new createjs.Spine("res/sceletons/powerup/powerup.atlas", "res/sceletons/powerup/powerup.json");
    this.powerup.setTransform(800, 180, 0.5, 0.5);
    this.powerup.onComplete = (function(_this) {
      return function() {
        return _this.spineComplete(_this.powerup, 0);
      };
    })(this);
    this.hero = new createjs.Spine("res/sceletons/hero/hero.atlas", "res/sceletons/hero/hero.json");
    this.hero.setTransform(800, 300, 0.5, 0.5);
    this.hero.onComplete = (function(_this) {
      return function() {
        _this.hero.setSkin('White');
        return _this.spineComplete(_this.hero, 1);
      };
    })(this);
    createjs.Ticker.on("tick", ((function(_this) {
      return function(e) {
        return _this.handleTick(e);
      };
    })(this)));
  }

  Example.prototype.spineComplete = function(spine, animateIndex) {
    spine.state.setAnimationByName(0, spine.state.data.skeletonData.animations[animateIndex].name, true);
    return this.stage.addChild(spine);
  };

  Example.prototype.handleTick = function(e) {
    this.stats.begin();
    this.dragon.update(e);
    this.ninja.update(e);
    this.goblin.update(e);
    this.hero.update(e);
    this.powerup.update(e);
    this.stage.update();
    return this.stats.end();
  };

  return Example;

})();

new Example;
