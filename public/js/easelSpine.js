var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

createjs.Spine = (function(_super) {
  __extends(Spine, _super);

  function Spine(atlas, json) {
    Spine.__super__.constructor.apply(this, arguments);
    spine.Bone.yDown = true;
    this.containers = [];
    this.pages = [];
    this.textureLoader = new createjs.Spine.TextureLoader;
    this.textureLoader.addEventListener('success', (function(_this) {
      return function() {
        return _this.textureLoadHandler();
      };
    })(this));
    this.queue = new createjs.LoadQueue(true);
    this.queue.addEventListener("complete", (function(_this) {
      return function() {
        return _this.srcLoadHandler();
      };
    })(this));
    this.queue.loadManifest([
      {
        src: json,
        id: "json"
      }, {
        src: atlas,
        id: "atlas"
      }
    ]);
  }

  Spine.prototype.srcLoadHandler = function() {
    var atlas, jsonSkeleton, skeletonData, stateData;
    this.queue.removeAllEventListeners();
    this.queue.addEventListener("complete", (function(_this) {
      return function() {
        return _this.imageLoadHandler(_this.textureLoader);
      };
    })(this));
    this.json = this.queue.getResult("json");
    atlas = this.queue.getResult("atlas");
    this.atlas = new spine.Atlas(atlas, {
      load: (function(_this) {
        return function(page, path, atlas) {
          return _this.textureLoader.load(page, path, atlas);
        };
      })(this),
      unload: (function(_this) {
        return function(texture) {
          return _this.textureLoader.unload(texture);
        };
      })(this)
    });
    jsonSkeleton = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(this.atlas));
    skeletonData = jsonSkeleton.readSkeletonData(this.json);
    this.skeleton = new spine.Skeleton(skeletonData);
    this.skeleton.updateWorldTransform();
    stateData = new spine.AnimationStateData(skeletonData);
    this.state = new spine.AnimationState(stateData);
    return this.imageLoadHandler();
  };

  Spine.prototype.textureLoadHandler = function() {
    return this.pageLoadHandler(this.textureLoader.page);
  };

  Spine.prototype.pageLoadHandler = function(page) {
    return this.pages.push(page);
  };

  Spine.prototype.setSkin = function(skinName) {
    var index, skin, _i, _ref, _results;
    skin = this.skeleton.data.findSkin(skinName);
    this.skeleton.setSkin(skin);
    _results = [];
    for (index = _i = 0, _ref = this.skeleton.drawOrder.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; index = 0 <= _ref ? ++_i : --_i) {
      _results.push((function(_this) {
        return function(index) {
          var slot;
          slot = _this.skeleton.drawOrder[index];
          _this.skeleton.skin.getAttachment(index, slot.data.name);
          return slot.setAttachment(_this.skeleton.skin.getAttachment(index, slot.data.name));
        };
      })(this)(index));
    }
    return _results;
  };

  Spine.prototype.imageLoadHandler = function() {
    var slot, _fn, _i, _len, _ref;
    _ref = this.skeleton.drawOrder;
    _fn = (function(_this) {
      return function(slot) {
        var attachment, slotContainer, texture;
        attachment = slot.attachment;
        slotContainer = new createjs.Container();
        _this.containers.push(slotContainer);
        _this.addChild(slotContainer);
        if (!(attachment instanceof spine.RegionAttachment)) {
          return;
        }
        slotContainer.name = attachment.rendererObject.name;
        texture = _this.createTexture(attachment, slot);
        slot.currentSprite = texture;
        slot.currentSpriteName = attachment.rendererObject.name;
        return slotContainer.addChild(texture);
      };
    })(this);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      slot = _ref[_i];
      _fn(slot);
    }
    return this.onComplete();
  };

  Spine.prototype.onComplete = function() {
    return false;
  };

  Spine.prototype.createTexture = function(attachment, slot) {
    var data, height, spriteSheet, texture, width, x, y;
    x = attachment.rendererObject.x;
    y = attachment.rendererObject.y;
    width = attachment.rendererObject.rotate ? attachment.rendererObject.height : attachment.rendererObject.width;
    height = attachment.rendererObject.rotate ? attachment.rendererObject.width : attachment.rendererObject.height;
    data = {
      images: [attachment.rendererObject.page.name],
      frames: [[x, y, width, height, 0, width / 2, height / 2]]
    };
    spriteSheet = new createjs.SpriteSheet(data);
    texture = new createjs.Sprite(spriteSheet);
    texture.rotation = -attachment.rotation;
    if (attachment.rendererObject.rotate) {
      texture.rotation = -(attachment.rotation - 90);
    }
    slot.sprites = slot.sprites || {};
    slot.sprites[attachment.rendererObject.name] = texture;
    return texture;
  };

  Spine.prototype.update = function(e) {
    var drawOrder, i, _i, _ref, _results;
    if (!this.skeleton) {
      return;
    }
    this.state.update(e.delta * 0.001);
    this.state.apply(this.skeleton);
    this.skeleton.updateWorldTransform();
    drawOrder = this.skeleton.drawOrder;
    _results = [];
    for (i = _i = 0, _ref = this.skeleton.drawOrder.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      _results.push((function(_this) {
        return function(i) {
          var attachment, bone, slot, slotContainer, sprite, spriteName;
          slot = drawOrder[i];
          attachment = slot.attachment;
          slotContainer = _this.containers[i];
          if (!(attachment instanceof spine.RegionAttachment)) {
            slotContainer.visible = false;
            return;
          }
          if (attachment.rendererObject) {
            if (!slot.currentSpriteName || slot.currentSpriteName !== attachment.name) {
              spriteName = attachment.rendererObject.name;
              if (slot.currentSprite !== void 0) {
                slot.currentSprite.visible = false;
              }
              slot.sprites = slot.sprites || {};
              if (slot.sprites[spriteName] !== void 0) {
                slot.sprites[spriteName].visible = true;
              } else {
                sprite = _this.createTexture(attachment, slot);
                slotContainer.addChild(sprite);
              }
              slot.currentSprite = slot.sprites[spriteName];
              slot.currentSpriteName = spriteName;
            }
          }
          slotContainer.visible = true;
          bone = slot.bone;
          slotContainer.x = bone.worldX + attachment.x * bone.m00 + attachment.y * bone.m01;
          slotContainer.y = bone.worldY + attachment.x * bone.m10 - attachment.y * bone.m11;
          slotContainer.scaleX = bone.worldScaleX;
          slotContainer.scaleY = bone.worldScaleY;
          slotContainer.rotation = -slot.bone.worldRotation;
          return slotContainer.alpha = slot.a;
        };
      })(this)(i));
    }
    return _results;
  };

  return Spine;

})(createjs.Container);

createjs.Spine.TextureLoader = (function(_super) {
  __extends(TextureLoader, _super);

  function TextureLoader() {
    return TextureLoader.__super__.constructor.apply(this, arguments);
  }

  TextureLoader.prototype.load = function(page, path, atlas) {
    this.page = page;
    this.path = path;
    this.atlas = atlas;
    return this.dispatchEvent('success');
  };

  TextureLoader.prototype.unload = function(texture) {
    texture.destroy();
    return this.dispatchEvent('error');
  };

  return TextureLoader;

})(createjs.EventDispatcher);
