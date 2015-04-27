class createjs.Spine extends createjs.Container

  constructor: (atlas, json) ->
    super
    spine.Bone.yDown = true

    @containers = []
    @pages = []

    @textureLoader = new createjs.Spine.TextureLoader
    @textureLoader.addEventListener 'success', => @textureLoadHandler()

    @queue = new createjs.LoadQueue(true)
    @queue.addEventListener "complete", => @srcLoadHandler()

    @queue.loadManifest([
      { src: json, id: "json" }
      { src: atlas, id: "atlas" }
    ])

  srcLoadHandler: ->
    @queue.removeAllEventListeners()
    @queue.addEventListener("complete", => @imageLoadHandler(@textureLoader))

    @json = @queue.getResult("json")
    atlas = @queue.getResult("atlas")

    @atlas = new spine.Atlas atlas,
      load: (page, path, atlas) =>
        @textureLoader.load(page, path, atlas)
      unload: (texture) =>
        @textureLoader.unload(texture)

    jsonSkeleton = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(@atlas))
    skeletonData = jsonSkeleton.readSkeletonData(@json)

    @skeleton = new spine.Skeleton skeletonData
    @skeleton.updateWorldTransform()

    stateData = new spine.AnimationStateData skeletonData
    @state    = new spine.AnimationState stateData

    @imageLoadHandler()

  textureLoadHandler: ->
    @pageLoadHandler(@textureLoader.page)

  pageLoadHandler: (page) -> @pages.push page

  setSkin: (skinName) ->
    skin = @skeleton.data.findSkin skinName
    @skeleton.setSkin skin

    for index in [0..@skeleton.drawOrder.length-1]
      do (index) =>
        slot = @skeleton.drawOrder[index]
        @skeleton.skin.getAttachment index, slot.data.name
        slot.setAttachment @skeleton.skin.getAttachment(index, slot.data.name)

  imageLoadHandler: ->
    for slot in @skeleton.drawOrder
      do (slot) =>
        attachment = slot.attachment
        slotContainer = new createjs.Container()
        @containers.push slotContainer
        @addChild slotContainer
        return unless attachment instanceof spine.RegionAttachment
        slotContainer.name = attachment.rendererObject.name
        texture = @createTexture( attachment, slot )
        slot.currentSprite = texture
        slot.currentSpriteName = attachment.rendererObject.name
        slotContainer.addChild texture
    @onComplete()

  onComplete: -> false

  createTexture: ( attachment, slot ) ->
    x = attachment.rendererObject.x
    y = attachment.rendererObject.y

    width = if attachment.rendererObject.rotate
      attachment.rendererObject.height
    else
      attachment.rendererObject.width

    height = if attachment.rendererObject.rotate
      attachment.rendererObject.width
    else
      attachment.rendererObject.height

    data =
      images: [attachment.rendererObject.page.name]
      frames: [[ x, y, width, height, 0, width/2, height/2, ]]

    spriteSheet = new createjs.SpriteSheet(data)
    texture = new createjs.Sprite(spriteSheet)
    texture.rotation = -(attachment.rotation)

    texture.rotation = -(attachment.rotation-90) if attachment.rendererObject.rotate

    slot.sprites = slot.sprites || {}
    slot.sprites[attachment.rendererObject.name] = texture

    return texture

  update: (e) ->
    return unless @skeleton
    @state.update(e.delta* 0.001)
    @state.apply(@skeleton)
    @skeleton.updateWorldTransform()

    drawOrder =  @skeleton.drawOrder
    for i in [0..@skeleton.drawOrder.length-1]
      do (i) =>
        slot = drawOrder[i]
        attachment = slot.attachment
        slotContainer = @containers[i]
        unless attachment instanceof spine.RegionAttachment
          slotContainer.visible = false
          return
        if attachment.rendererObject
          if !slot.currentSpriteName or slot.currentSpriteName != attachment.name
            spriteName = attachment.rendererObject.name
            slot.currentSprite.visible = false if slot.currentSprite != undefined
            slot.sprites = slot.sprites || {}
            if slot.sprites[spriteName] != undefined
              slot.sprites[spriteName].visible = true
            else
              sprite = @createTexture(attachment, slot)
              slotContainer.addChild(sprite)
            slot.currentSprite = slot.sprites[spriteName]
            slot.currentSpriteName = spriteName

        slotContainer.visible = true

        bone = slot.bone
        slotContainer.x = bone.worldX + attachment.x * bone.m00 + attachment.y * bone.m01
        slotContainer.y = bone.worldY + attachment.x * bone.m10 - attachment.y * bone.m11
        slotContainer.scaleX = bone.worldScaleX
        slotContainer.scaleY = bone.worldScaleY

        slotContainer.rotation = -slot.bone.worldRotation
        slotContainer.alpha = slot.a

class createjs.Spine.TextureLoader extends createjs.EventDispatcher

  load: (page, path, atlas) ->
    @page = page
    @path = path
    @atlas = atlas

    @dispatchEvent('success')

  unload: (texture) ->
    texture.destroy()
    @dispatchEvent('error')