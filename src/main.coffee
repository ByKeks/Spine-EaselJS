class Example

  constructor: ->

    @canvas = document.getElementById("myCanvas")
    createjs.Ticker.setFPS(160)

    @stats = new Stats()

    document.body.appendChild( @stats.domElement )
    @stats.domElement.style.position = "absolute"
    @stats.domElement.style.top = "0px"

    @stage = new createjs.Stage(@canvas)
    @stage.enableMouseOver(10)

    @dragon = new createjs.Spine("res/sceletons/dragon/dragon.atlas", "res/sceletons/dragon/dragon.json")
    @dragon.setTransform(300, 220, 0.5, 0.5)
    @dragon.onComplete = => @spineComplete(@dragon, 0)

    @ninja = new createjs.Spine("res/sceletons/ninja/speedy.atlas", "res/sceletons/ninja/speedy.json")
    @ninja.setTransform(600, 180, 0.5, 0.5)
    @ninja.onComplete = => @spineComplete(@ninja, 1)

    @goblin = new createjs.Spine("res/sceletons/goblins/goblins.atlas", "res/sceletons/goblins/goblins.json")
    @goblin.setTransform(600, 500, 1, 1)
    @goblin.onComplete = =>
      @goblin.setSkin('goblin')
      @spineComplete(@goblin, 0)

    @powerup = new createjs.Spine("res/sceletons/powerup/powerup.atlas", "res/sceletons/powerup/powerup.json")
    @powerup.setTransform(800, 180, 0.5, 0.5)
    @powerup.onComplete = =>
      @spineComplete(@powerup, 0)

    @hero = new createjs.Spine("res/sceletons/hero/hero.atlas", "res/sceletons/hero/hero.json")
    @hero.setTransform(800, 300, 0.5, 0.5)
    @hero.onComplete = =>
      @hero.setSkin('White')
      @spineComplete(@hero, 1)

    createjs.Ticker.addEventListener("tick", ((e)=>@handleTick(e)))

  spineComplete: (spine, animateIndex) ->
    spine.state.setAnimationByName(0, spine.state.data.skeletonData.animations[animateIndex].name, true)
    @stage.addChild spine

  handleTick: (e) ->
    @stats.begin()

    @dragon.update(e)
    @ninja.update(e)
    @goblin.update(e)
    @hero.update(e)
    @powerup.update(e)

    @stage.update()

    @stats.end()

new Example