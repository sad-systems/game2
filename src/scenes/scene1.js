/*==============================================================================
 *  Title      : Scene 2
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru> 
 *  Created on : 27.04.2016, 17:24:18
 *==============================================================================
 */

var basic          = require('basic'),
    toolButtons    = require('toolButtons'),
    gamepadButtons = require('gamepadButtons'),
    menuScene      = 'scLogo',
    levelMaps      = {
        level1: require('../tilemaps/level1.json')
    };

var playerMass      = 100,
    playerGravity   = 300,
    playerBounce    = 0.3,
    playerVelocityX = 150,
    blockMass       = playerMass,
    blockGravity    = playerGravity,
    blockBounce     = 0.5;

function makeSpriteFromTile(tile, tilemap, game) {
    var tilesetIndex = tilemap.tiles[tile.index][2],
        tileset      = tilemap.tilesets[tilesetIndex],
        sprite       = game.make.sprite(tile.worldX, tile.worldY, tileset.name, tile.index - tileset.firstgid);
        if (tile.properties) sprite.properties = tile.properties;
        sprite.parentMapLayer = tile.layer.name;
    return sprite;
    //map.createFromTiles(layer.data[row][cell].index, -1, 'P1', i, prizes); //, properties)
}

function setPlayerXY(player, x, y) {
    player.x = x + player.width *player.anchor.x*player.scale.x,
    player.y = y + player.height*player.anchor.y*player.scale.y;
};

//------------------------------------------------------------------------------
// Scene
//------------------------------------------------------------------------------

function getAnimationFrames(baseName, numbers){
    function getZeroPrefix(index) {
        if (index<9)  return '00' + index;
        if (index<99) return '0'  + index;
    return index;    
    }
    
    if (!(numbers instanceof Array)) numbers = [numbers];
    var frames = [];
    for (var i=0; i<numbers.length; i++) {
        frames[i] = baseName + '_' + getZeroPrefix(numbers[i]) + '.png';
    }
return frames;    
};

var scene = function () {};
    scene.prototype = {
        
        preload: function() {
            // Static images:
            this.game.load.image('bg',       'assets/bg/1/sc1bg2.jpg');
            this.game.load.image('ground',   'assets/bg/1/ground.png');
            //this.game.load.image('tiles', 'assets/sprites/tiles/forest-ground-block.gif');
            
            this.game.load.image('joystick', 'assets/sprites/controls/joystick2.png');
            
            // Spritesheets:
            //this.game.load.spritesheet('prizes', 'assets/sprites/tiles/prizes.png', 32, 25);
            //this.game.load.atlas('prizes',  'assets/sprites/tiles/prizes.png', 'assets/sprites/tiles/prizes.json');
            
            this.game.load.atlas('dragon',  'assets/sprites/dragon/dragon.png', 'assets/sprites/dragon/dragon.json');
            
            this.game.load.atlas('gamepadButtons', 'assets/sprites/controls/gamepad.png', 'assets/sprites/controls/gamepad.json');
            this.game.load.atlas('toolButtons', 'assets/sprites/controls/tools.png', 'assets/sprites/controls/tools.json');
            
            // Level talemap: --------------------------------------------------
            var rootPath = 'assets/';
            if (levelMaps && typeof(levelMaps) === 'object') {
                for (var levelName in levelMaps) {
                    if (!levelMaps.mainName) levelMaps.mainName = levelName;
                    var levelMap = levelMaps[levelName];
                    this.game.load.tilemap(levelName, null, levelMap, Phaser.Tilemap.TILED_JSON);
                    for (var i=0; i<levelMap.tilesets.length; i++) {
                        var tileset  = levelMap.tilesets[i],
                            image    = tileset.image;
                        image = image.replace(new RegExp('^[\.\/]*' + RegExp.escape(rootPath)), rootPath);
                        //this.game.load.image(tileset.name, image);  //console.log(tileset);
                        this.game.load.spritesheet(tileset.name, image, tileset.tilewidth, tileset.tileheight);  //console.log(tileset);
                    }
                }
            }
            //this.game.load.image  ('mapLevel1tiles1', 'assets/sprites/tiles/Blocks.gif');
            //------------------------------------------------------------------
        },
        
        create: function() {

            //--- Game settings:
            var game = this.game;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //Show the entire game display area while maintaining the original aspect ratio.
            
            //--- Enable the Arcade Physics system:
            game.physics.startSystem(Phaser.Physics.ARCADE);

            //--- Set world size:
            //game.world.setBounds(0, 0, 960, 640); 

            //--- Background:
            //game.add.image(0, 0, 'bg');
            game.add.tileSprite(0, 0, 5000, 700, 'bg');
            //var ground = game.add.image(0, game.world.height, 'ground');
            //    ground.anchor.set(0,1); //console.log(ground);

            //--- Platforms (ground):
            //this.platforms = game.add.group();
            //var platforms = this.platforms;
            //    platforms.enableBody = true; // Enable physics for any object that is created in this group
            
            //--- Player arsenal (resources):
            this.collectedGoods = [];
            //--- Create tilemap:     
            var map = this.map = game.add.tilemap(levelMaps.mainName);
            //  map.setTileIndexCallback([53,54,55,56,57,58,59,60,61], this.getPrize, this, 'Prizes');
            //--- Add tilesets:
            for (var i=0; i<map.tilesets.length; i++) {
                var tileset  = map.tilesets[i];
                map.addTilesetImage(tileset.name, tileset.name); // map.addTilesetImage('Blocks', 'mapLevel1tiles1');
            }             
            //--- Create layers:
            this.layers = {
                platforms: [],
                stairs:    [],
                goods:     [],
                all:       []
            };
            for (var i=0; i<map.layers.length; i++) {
                //--- Create only visible:
                if (!map.layers[i].visible) continue; 
                var worldLayer = map.createLayer(i); //console.log(worldLayer);
                var layer = worldLayer.layer; //map.layers[i];
                this.layers.all.push(worldLayer); //--- Keep all
                if (layer.properties) {
                    //--- Platforms:
                    if (layer.properties['platform']) {
                        this.layers.platforms.push(worldLayer);
                        //--- Find collision tiles:
                        var collisions = []; //console.log(layer.data);
                        for (var row in layer.data) {
                            for (var cell in layer.data[row]) {
                                if (layer.data[row][cell].index !== -1) collisions.push(layer.data[row][cell].index); 
                            }
                        }
                        //--- Set collisions:
                        if (collisions.length > 0) 
                            map.setCollision(collisions, true, i);
                    }
                    //--- Stairs:
                    if (layer.properties['stair']) { 
                        this.layers.stairs.push(worldLayer);
                    }
                    //--- Prizes:
                    if (layer.properties['prize']) {
                        var prizes = this.prizes = game.add.group();
                            prizes.enableBody = true;
                        for (var row in layer.data) {
                            for (var cell in layer.data[row]) {
                                if (layer.data[row][cell].index !== -1) {
                                    var tile = layer.data[row][cell];
                                    prizes.add(makeSpriteFromTile(tile, this.map, this.game));
                                    tile.index = -1; //--- clear tile
                                }
                            }
                        }                        
                    }
                    //--- Blocks:
                    if (layer.properties['block']) {
                        var blocks = this.blocks = game.add.group();
                            blocks.enableBody    = true;
                        for (var row in layer.data) {
                            for (var cell in layer.data[row]) {
                                if (layer.data[row][cell].index !== -1) {
                                    var tile = layer.data[row][cell];
                                    var sprite = makeSpriteFromTile(tile, this.map, this.game);
                                    blocks.add(sprite);
                                    sprite.body.mass      = blockMass;
                                    sprite.body.gravity.y = blockGravity;
                                    sprite.body.bounce.y  = blockBounce;
                                    sprite.body.collideWorldBounds = true;
                                    tile.index = -1; //--- clear tile
                                }
                            }
                        }
                    }
                    //--- Goods:
                    if (layer.properties['goods']) {
                        this.layers.goods.push(worldLayer);
                    }
                }
            };
            
            //--- Resize the world (by the first):
            if (this.layers.all[0])
                this.layers.all[0].resizeWorld(); //console.log(this.map.getLayerIndex('Platforms'));
            
            //--- Start point:
            this.startPoint = { x:game.width/2 , y:game.height/2 };
            
            //--- Game objects:
            this.objects = {
                doors: {}
            };
            for (var name in map.objects) {
                var objs = map.objects[name];
                for (var j in objs) {
                    var obj = objs[j];
                    //--- Start point:
                    if (obj.type == 1) {
                        this.startPoint = { x:obj.x, y:obj.y };
                    }
                    //--- Exit point:
                    if (obj.type == 2) {
                        this.exitPoint = { x:obj.x, y:obj.y };
                    }                    
                    //--- Door & Gates:
                    if (obj.properties && (typeof(obj.properties.lock) != 'undefined' || obj.properties.gate_target)) {
                        this.objects.doors[obj.name] = obj;
                    }
                    //----------
                };
            };
            //console.log('GATES: ', this.objects, map);
            //------------------------------------------------------------------
                            
            //--- Player:    
            var player = this.player = game.add.sprite(0, 0, 'dragon', 'stay_001.png');
                player.anchor.set(0.5, 1);
                player._gravityY  = playerGravity;
                player._bounceY   = playerBounce;
                setPlayerXY(this.player, this.startPoint.x, this.startPoint.y);
            var animationTurn     = getAnimationFrames('turn', [1,2,3,4]),
                animationTurnBack = getAnimationFrames('turn', [4,3,2,1]);    
            player.animations.add('stay', getAnimationFrames('stay', [1,2,3,4,5,6,7,8]), 10, true, false);
            player.animations.add('go', getAnimationFrames('go', [1,2,3,4,5]), 10, true, false);
            player.animations.add('turn',     animationTurn, 10, false, false);
            player.animations.add('turnback', animationTurnBack, 10, false, false);
            player.animations.add('turnaround', getAnimationFrames('turn', [1,2,3,4,5,6,7,8]), 10, false, false);
            player.animations.add('jump', getAnimationFrames('jump', [1,2,3]), 10, false, false);
            player.animations.add('fly', getAnimationFrames('fly', [4,5,6,7,8,9]), 10, true, false);
            player.animations.add('fall', getAnimationFrames('fall', [1,2]), 10, true, false);
            player.animations.add('falldown', getAnimationFrames('falldown', [1,2,3,4,5]), 10, false, false);
            player.animations.add('climb', getAnimationFrames('climb', [1,2,3,4]), 10,  true, false);
            player.animations.add('fire', getAnimationFrames('spew', [1,2,2,2,1]), 10, false, false);
            player.animations.add('open', animationTurn.concat(getAnimationFrames('open', [1,2,1,2,1,2])).concat(animationTurnBack), 10, false, false);
            player.animations.add('no',  getAnimationFrames('no', [1,2,3,4,1,2,3,4]), 10, false, false);
            player.animations.add('yes', getAnimationFrames('yes', [1,2,3,4]), 10, false, false);
            player.animations.add('oh', getAnimationFrames('oh', [1,2,3,4,5,6,7,8,9,10,11,12]), 10, false, false);
            player.animations.add('wow', getAnimationFrames('wow', [1,2,3,4,5,6,7,8,9]), 10, false, false);
            player.animations.add('lovely', getAnimationFrames('lovely', [1,2,3,4,5,6,7,8]), 10, false, false);
            player.animations.add('eat', getAnimationFrames('eat', [1,2,3,4,5,6,7,8]), 10, false, false);
            player.animations.add('get', getAnimationFrames('get', [1,2,3,4,5,6,5,6,5,4,3,2,1]), 10, false, false);
            player.animations.add('clap', getAnimationFrames('clap', [1,2,3,4,5,6,7,8,9,10,11,12,13]), 10, false, false);
            player.animations.add('bye', getAnimationFrames('bye', [1,2,1,2,1,2,1,2,1,2]), 10, false, false);
            player.animations.play('stay');
            //  Enable physics on the player:
            game.physics.arcade.enable(player);
            player.body.bounce.y  = player._bounceY;
            player.body.gravity.y = player._gravityY;
            player.body.mass      = playerMass;
            player.body.collideWorldBounds = true;
            this.playerSetSize();            
            //------------------------------------------------------------------

            //--- Gamepad: -------------------
            var self = this;
            var gp = gamepadButtons.create({game:game, buttons:{
                Up:     { 
                            onDown:this.actionUp.bind(this), 
                              onUp:this.actionUpRelease.bind(this) 
                        },
                Down:   { 
                            onDown:this.actionDown.bind(this), 
                              onUp:this.actionDownRelease.bind(this) 
                        },
                Left:   { 
                            onDown:this.actionLeft.bind(this), 
                              onUp:this.actionLeftRelease.bind(this) 
                        },
                Right:  { 
                            onDown:this.actionRight.bind(this), 
                              onUp:this.actionRightRelease.bind(this) 
                        },
                Fire:   {
                            onDown:this.actionSpace.bind(this)
                        },
                A:      {
                            onDown:this.actionA.bind(this)
                        },
                B:      {
                            onDown:this.actionB.bind(this)
                        }
                //C:     { onDown:function(o){ console.log('C'); } },
                //D:     { onDown:function(o){ console.log('D'); } },
            }});
            game.scale.onFullScreenChange.add(function(){ gp.setButtons(); });
        
            //--- Game pad 2:
            //var b = this.game.add.button(490 -10, 330 -10, 'joystick', null, this);
            //    b.fixedToCamera = true;
            //    b.alpha = 0.5;
            //---------------
        
            //--- Keyboard controls:
            //this.cursors = game.input.keyboard.createCursorKeys();
            //--- Capture keys: (hide from browser)
            var capturedKeys = [
                Phaser.KeyCode.UP,
                Phaser.KeyCode.DOWN,
                Phaser.KeyCode.LEFT,
                Phaser.KeyCode.RIGHT,
                Phaser.KeyCode.ALT,
                Phaser.KeyCode.CONTROL,
                Phaser.KeyCode.SPACEBAR
            ];
            for (var i=0; i<capturedKeys.length; i++) {
                game.input.keyboard.addKeyCapture(capturedKeys[i]);
            };
            //--- Keyboard callbacks:
            game.input.keyboard.addCallbacks(this, 
                //--- On key down:
                function(KeyboardEvent) {
                    if(KeyboardEvent.repeat) return; //--- Do not capture repeating events
                    switch (KeyboardEvent.keyCode) {
                        case Phaser.KeyCode.UP:       this.actionUp(); break;
                        case Phaser.KeyCode.DOWN:     this.actionDown(); break;
                        case Phaser.KeyCode.LEFT:     this.actionLeft(); break;
                        case Phaser.KeyCode.RIGHT:    this.actionRight(); break;
                        case Phaser.KeyCode.SPACEBAR: this.actionSpace(); break;
                        case Phaser.KeyCode.ALT:      this.actionA(); break;
                        case Phaser.KeyCode.CONTROL:  this.actionB(); break;
                    }
                }, 
                //--- On key up:
                function(KeyboardEvent) {
                      switch (KeyboardEvent.keyCode) {
                        case Phaser.KeyCode.UP:       this.actionUpRelease(); break;
                        case Phaser.KeyCode.DOWN:     this.actionDownRelease(); break;
                        case Phaser.KeyCode.LEFT:     this.actionLeftRelease(); break;
                        case Phaser.KeyCode.RIGHT:    this.actionRightRelease(); break;
                    }
                }
            );
                            
            //--- Tools button:---------------
            var tb = toolButtons.create({game:game, x:10, y:10, buttons:{
                Fullscreen:{ state:game.scale.isFullScreen, onDown:function(o) { 
                                game.extentions.sceneManager.gotoFullScreen();
                                this.resizeGame();
                                o.setState(game.scale.isFullScreen); 
                             }.bind(this) 
                           },
                Music:     { state:0, onDown:function(o){ o.setState(!o.state); console.log('Music: ' + o.state); } },
                Sound:     { state:0, onDown:function(o){ o.setState(!o.state); console.log('Sound: ' + o.state); } },
                Gamepad:   { state:gp.groupButtons.visible, onDown:function(o){ gp.toggleWithInverse(); o.setState(gp.groupButtons.visible); } },
                Settings:  {},
                Menu:      { onDown:function(o){ game.extentions.sceneManager.next(menuScene); } }
            }});
            //--------------------------------

            //--- Set camera:
            this.game.camera.follow(this.player);
            //var h = 160;
            //this.game.camera.deadzone = new Phaser.Rectangle(this.game.camera.width/2, h, 0, this.game.camera.height - h*2);
            var x = this.game.camera.width*0.2,  // %
                y = this.game.camera.height*0.2; // %    
            this.game.camera.deadzone = new Phaser.Rectangle(x, y, this.game.camera.width - x*2, this.game.camera.height - y*2);
            
            //--- Start:
            game.extentions.sceneManager.begin();
            
            
        },
        
        isPlayerBlockedDown: function() {
            //if (this.player.body.touching.down) {
            if (this.player.body.blocked.down || this.player.body.wasTouching.down || this.player.body.touching.down || !this.player.body.gravity.y) return true;
            return false;
        },
        
        update: function() {
            
            //--- Collide the player and the platforms:
            for (var i in this.layers.platforms)
                this.game.physics.arcade.collide(this.player, this.layers.platforms[i], function(player, layer) {}, null, this); //platforms
            //--- Collide the player and the stairs:
            for (var i in this.layers.stairs)
                this.game.physics.arcade.collide(this.player, this.layers.stairs[i], function(player, layer) {}, null, this); //stairs
            //--- Collide the player and the prizes:
              //this.game.physics.arcade.collide(this.player, this.prizes, null, function(player, prize) { this.getPrize(prize); return false; }.bind(this),  this); //prizes
                this.game.physics.arcade.overlap(this.player, this.prizes, function(player, prize) { this.getPrize(prize); return false; }, null, this); //prizes
            //--- Collide blocks:
                this.game.physics.arcade.collide(this.player, this.blocks,
                    function(player, block) {
                        if (player.body.velocity.x > 0 && player.body.touching.right) { 
                            player.body.velocity.x = playerVelocityX;
                        } else 
                        if (player.body.velocity.x < 0 && player.body.touching.left) {
                            player.body.velocity.x = -playerVelocityX;
                        }
                        block.body.velocity.x = 0; 
                    },
                    null,
                    this
                );
                this.game.physics.arcade.collide(this.blocks, this.blocks, null, null,  this);
            for (var i in this.layers.platforms)
                this.game.physics.arcade.collide(this.blocks, this.layers.platforms[i], function(player, layer) {}, null, this);

            //--- Flying & Falling:
            if (!this.isPlayerBlockedDown()) {
                this._landed = false; // leave the ground
                if (this.player.body.velocity.y > 0) {
                    //--- Falling:
                    //console.log('Falling:', this.player.body.velocity.y, this.player.body.wasTouching.down, this.player.body.touching.down);
                    if (this.player.body.velocity.y > 100) { //--- Hide bounce: (%!!!)
                        if (this.arrowUpPressed) {
                            this.flyUp();
                        } else {
                            this.fallDown();
                        }
                    }
                } else {
                    //--- Flying:
                    //console.log('Flying:', this.player.body.velocity.y, this.player.body.wasTouching.down, this.player.body.touching.down);
                }
            }
            
            //--- Landidng:
            if (this.isPlayerBlockedDown() && !this._landed) {
                this._landed = true;
                //console.log('Landed:', this.player.body.velocity.y, this.player.body.touching.down, this.player.body.wasTouching.down);
                if (this.player.body.velocity.x === 0) {
                    this.doStay();
                } else {
                    this.doGo();
                }
            }
           
            //--- Climbing:
            this.climbState = this.canClimb();
          
            if (this.climbState.up || this.climbState.down) {
                if (this.player.body.gravity.y) {
                    //--- Disable gravity:
                    this.player.body.velocity.y = 0;
                    this.player.body.bounce.y   = 0;
                    this.player.body.gravity.y  = 0;
                    //--- Align by Y:
                    if (this.climbState.down && (this.player.y - this.climbState.down.y < 3)) {
                        this.player.body.prev.x = this.player.body.x;
                        this.player.body.prev.y = this.player.body.y;
                        this.player.y = this.climbState.down.y;
                    }
                    //console.log('ready to climb: ', this.player.y, this.climbState.down.y);
                }
            } else {
                if (this.player.body.gravity.y === 0) {
                    //console.log('restore gravity');
                    //--- Restore gravity:
                    if (this.player.animations.currentAnim.name === 'climb')
                        this.player.body.velocity.y = 0;
                    this.player.body.gravity.y  = this.player._gravityY;
                    this.player.body.bounce.y   = this.player._bounceY;
                    if (this.player.animations.currentAnim.name === 'climb') {
                        this.showAnimation('turnback', this.actionStop.bind(this));
                    }
                }
            }
            
            //--- Cancel bouncing (if arrou up is pressed):
            //if (this.arrowUpPressed && this.player.body.bounce.y > 0) {
            //    console.log('Cancel bouncing');
            //    this.player.body.bounce.y = 0;
            //}

        },
        
        render: function () {
            //var zone = this.game.camera.deadzone;
            //if (this.game.canvas) {
            //    this.game.canvas.fillStyle = 'rgba(255,0,0,0.6)';
            //    this.game.canvas.fillRect(zone.x, zone.y, zone.width, zone.height);
            //}
            //this.game.debug.cameraInfo(this.game.camera, 32, 32);
            //this.game.debug.spriteCoords(this.player, 32, 500);
            //this.game.debug.body(this.player);
            //this.game.debug.bodyInfo(this.player, 32, 320);
        },        
        
        //----------------------------------------------------------------------
        
        playerSetSize: function() {
            this.player.body.setSize(32, 42, 7*this.player.scale.x, 0);
        },

        //----------------------------------------------------------------------
        
        fallDown: function() {
            //  Fall
            if (!this._transition) this.player.animations.play('fall');
        }, 

        flyUp: function() {
            //  Fly
            if (this._landed) {
                this.player.body.velocity.y = -220;
            }
            if (!this._transition) this.player.animations.play('fly');
        },    
    
        climbUp: function() {
            if (this.arrowUpPressed && this.climbState.up) {
                this.player.body.velocity.y = -100;
                if (!this._transition) this.player.animations.play('climb');
            }  else { 
                this.showAnimation('turnback', this.actionStop.bind(this)); 
            }
        },
        
        climbDown: function() {
            if (this.arrowDownPressed && (this.climbState.down || !this.player.body.blocked.down)) {
                this.climbDownPressed = true;
                this.player.body.velocity.y = 100;
                if (!this._transition) this.player.animations.play('climb');
                //  this.showAnimation('climb', this.climbDown.bind(this));
            } else {
                this.showAnimation('turnback', this.actionStop.bind(this)); 
            }
        },        
        
        climbStop: function() {
            this.player.body.velocity.y = 0;
            if (this.player.animations.currentAnim.name === 'climb')
                this.showAnimation('turnback', this.actionStop.bind(this));
        },
        
        actionUp: function() {
            //  Jump & Fly || Climb up
            this.arrowUpPressed = true;
            if (this._landed && !this._transition) {
                if (this.climbState.up) {
                    //--- Align to center X of stair:
                    this.player.x = this.climbState.up.xCenter;
                    //this.player.y;
                    //--- Climb up ---
                    if (this.player.animations.currentAnim.name !== 'climb') {
                        //--- First need to turn:
                        this.showAnimation('turn', function() {
                            this.climbUp();
                        }.bind(this));
                    } else {
                        this.climbUp();
                    }
                    //----------------
                } else {
                    //--- Jump & Fly ---
                    this._transition = true;
                    var ani = this.player.animations.getAnimation('jump');
                        ani.onComplete.addOnce(function(){
                            this._transition = false;
                            this.flyUp();
                            //--- Fly & Move:
                            if (this.arrowLeftPressed && this.player.body.velocity.x === 0) this.actionLeft();
                            if (this.arrowRightPressed && this.player.body.velocity.x === 0) this.actionRight();
                            //---
                        }, this);
                        ani.play();
                    //--------------------
                }
            }
        },
        actionUpRelease: function() {
            this.arrowUpPressed = false;
            this.climbStop();
        },
        
        actionDown: function() {
            this.arrowDownPressed = true;
            if (this.climbState.down || !this.player.body.blocked.down) {
                //--- Align to center X of stair:
                if (this.climbState.down)
                    this.player.x = this.climbState.down.xCenter;
                //--- Climb Down ---
                if (this.player.animations.currentAnim.name !== 'climb') {
                    //--- First need to turn:
                    this.showAnimation('turn', function() {
                        this.climbDown();
                    }.bind(this));
                } else {
                    this.climbDown();
                }
                //----------------
            }
        },
        
        actionDownRelease: function() {
            this.arrowDownPressed = false;
            this.climbDownPressed = false;
            this.climbStop();
        },
        
        
        moveLeft: function() {
            //  Move to the left
            this.player.body.velocity.x = -150;
            if (this.isPlayerBlockedDown() && !this.player.body.blocked.left)
                this.doGo();
            //--- Fly & Move:
            if (this.arrowUpPressed) this.flyUp();
        },
        actionLeft: function() {
            this.arrowLeftPressed = true;
            if (this._transition) return;
            if (this.player.scale.x !== -1) {
                var currentAnimName = this.player.animations.currentAnim.name; // save current animation
                this.actionStop();
                this._transition = true;
                var ani = this.player.animations.getAnimation('turnaround');
                    ani.onComplete.addOnce(function(){
                        this._transition = false;
                        this.player.animations.getAnimation(currentAnimName).play(); // restore current animation after rotate
                        this.player.scale.set(-1, 1);
                        this.playerSetSize(-1);
                        if (this.arrowLeftPressed)
                            this.moveLeft();
                        else 
                            this.actionStop();
                    }, this);
                    ani.play();
            } else {
                this.moveLeft();
            }
        },
        actionLeftRelease: function() {
            this.arrowLeftPressed = false;
            if (!this._transition) this.actionStop();
        },
        
        moveRight: function() {
            //  Move to the right
            this.player.body.velocity.x = 150;
            if (this.isPlayerBlockedDown() && !this.player.body.blocked.right)
                this.doGo();
            //--- Fly & Move:
            if (this.arrowUpPressed) this.flyUp();
        },
        actionRight: function() {
            this.arrowRightPressed = true;
            if (this._transition) return;
            if (this.player.scale.x !== 1) {
                var currentAnimName = this.player.animations.currentAnim.name; // save current animation
                this.actionStop();
                this._transition = true;
                var ani = this.player.animations.getAnimation('turnaround');
                    ani.onComplete.addOnce(function(){  
                        this._transition = false;
                        this.player.animations.getAnimation(currentAnimName).play(); // restore current animation after rotate
                        this.player.scale.set(1, 1);
                        this.playerSetSize(1);
                        if (this.arrowRightPressed)
                            this.moveRight();
                        else 
                            this.actionStop();
                    }, this);
                    ani.play();
            } else {
                this.moveRight();
            }
        },
        actionRightRelease: function() {
            this.arrowRightPressed = false;
            if (!this._transition) this.actionStop();
        },

        
        actionSpace: function() {
            this.doFire();
            //console.log('Fire');
        },
        
        actionA: function() {
            this.doGetOpen();
            //console.log('A');
        },
        
        actionB: function() {
            this.doTest();
            //console.log('B');
        },

        actionStop: function() {
            //  Stand still
            //console.log(this.player.animations.currentAnim.name);
            this.player.body.velocity.x = 0;
            if (this.isPlayerBlockedDown() && !this._transition) {
                this.doStay();
            }
        },
        
        //----------------------------------------------------------------------
        
        doStay: function() {
            //  Stand still
            if (!this._transition) this.player.animations.play('stay');
            //this.player.animations.stop();
            //this.player.frame = 4;
        },    
                
        doGo: function() {
            //  Go
            if (!this._transition) this.player.animations.play('go');
        },
        
        doFire: function() {
            //  Fire
            //if (!this._transition) this.player.animations.play('fire');
            this.showAnimation('fire', function(){
                if (this.isPlayerBlockedDown()) {
                    this.doStay();
                }
            }.bind(this));
        },
        
        doorOpen: function(door) {
            //--- Open the door:
            this.showAnimation('open', function() {
                var cover_layer = door.properties ? door.properties['cover_layer'] : null;
                //--- Clear cover layer:
                if (cover_layer) {
                    var ix = door.width / this.map.tileWidth,
                        iy = door.height / this.map.tileHeight;
                    for (var i=0; i<ix; i++) {
                        for (var j=0; j<iy; j++) {
                        var tile = this.map.getTileWorldXY(door.x + i*this.map.tileWidth, door.y + j*this.map.tileHeight, this.map.tileWidth, this.map.tileHeight, cover_layer);
                            if (tile) {
                                tile.index = -1;
                                tile.layer.dirty = true;
                            }
                        }
                    }
                }
                //--- Delete the lock:
                delete door.properties.lock;
                //--- OK! It's opened:
                this.showAnimation('yes', this.actionStop.bind(this));
                //--------------------
            }.bind(this));
        }, 
        
        doGetOpen: function() {
            
            //--- Get some goods:
            var tile = this.isThereSomeGoods();
            if (tile && !this.isThereSomeCover(tile.worldX, tile.worldY, tile.layer.name)) {
                this.showAnimation('open', function() {
                    //--- Save goods:
                    this.collectedGoods.push(tile); console.log('GOODS:', this.collectedGoods);
                    //--- Clear tile:
                    tile.index = -1;
                    tile.layer.dirty = true;
                    //--- OK! I get it: 
                    this.showAnimation('yes', this.actionStop.bind(this));
                }.bind(this));
                return;
            }
            
            //--- Try to open the door:
            var door   = this.isThereSomeDoor(),
                opened = false;
            if (door) {
                if (door.properties && typeof(door.properties.lock) != 'undefined') {
                    if (door.properties.lock == '') {
                        //--- Just open:
                        this.doorOpen(door);
                        return ;
                    } else {
                        //--- Need the key:
                        for (var i in this.collectedGoods) {
                            if (this.collectedGoods[i].properties && this.collectedGoods[i].properties.name == door.properties.lock) {
                                //--- Open the door:
                                this.doorOpen(door);
                                return ;
                            }
                        }
                    }
                } else {
                    opened = true;
                }
            }
            
            //--- Come in:
            if (opened &&
                door.properties &&
                door.properties.gate_target &&
                this.objects.doors[door.properties.gate_target]
                ) {
                    var target = this.objects.doors[door.properties.gate_target];
                    this.showAnimation('turn', function() {
                        setPlayerXY(this.player, target.x, target.y);
                        this.showAnimation('turnback', this.actionStop.bind(this));
                    }.bind(this));
                return;
            }
            
            //--- Sorry, I can't...
            this.showAnimation('no', this.actionStop.bind(this));
        },
        
        doTest: function() {
            //  For test
            if (this.isPlayerBlockedDown()) {
                this.showAnimation('wow', this.actionStop.bind(this));
                //this.showAnimation('oh', this.actionStop.bind(this));
                //this.showAnimation('eat', function(){ this.showAnimation('lovely', this.actionStop.bind(this)) }.bind(this));
                //this.showAnimation('bye', this.actionStop.bind(this));
                //this.showAnimation('clap', this.actionStop.bind(this));
                //this.showAnimation('get', this.actionStop.bind(this));
                //this.showAnimation('falldown', this.actionStop.bind(this));
                //this.showAnimation('turn', function(){ this.showAnimation('climb', function(){ this.showAnimation('turnback', this.actionStop.bind(this)); }.bind(this)) }.bind(this));
            }
        },        

        //----------------------------------------------------------------------
        
        showAnimation: function(name, onComplete) {
            if (!this._transition) {
                this.actionStop();
                this._transition = true;
                var ani = this.player.animations.getAnimation(name);
                    ani.onComplete.addOnce(function(){  
                        this._transition = false;
                        if (typeof(onComplete) === 'function') onComplete();
                    }, this);
                    ani.play();
            }
        },
        
        //----------------------------------------------------------------------
        
        resizeGame: function () {
            for(var i in this.layers.all) {
                this.layers.all[i].resize(this.game.width, this.game.height);
            }
        },
        
        
        clearTile: function(tile) {
            tile.index = 0;
            tile.alpha = 0;
            //tile.destroy();
            tile.layer.dirty = true;
        },
        
        changeTile: function(tile, index) {
            //console.log(tile);
            tile.index = index;
            //tile.destroy();
            tile.layer.dirty = true;
        },
        
        getPrize: function(sprite) { //console.log('Here is a prize');
            if (typeof(sprite.parentMapLayer) == 'undefined' || !this.isThereSomeCover(sprite.x, sprite.y, sprite.parentMapLayer)) {
                console.log('I GET the PRIZE:', sprite);
                sprite.destroy();
                //if (tile.index === 61)
                //    this.changeTile(tile, 62); // change
                //else 
                //    this.clearTile(tile);      // destroy
                //return false;
            }
        },
        
        getTileCenterX: function(tile) { return tile.worldX + tile.width/2; },
        getPlayerDeltaX: function(x) { return Math.abs(x - this.player.x - this.player.scale.x*5); },
        getClimbPosition: function(tile) {
            var centerX  = this.getTileCenterX(tile);
            if (this.getPlayerDeltaX(centerX) < 11) {
                return {
                    x      : tile.worldX, 
                    xCenter: centerX,
                    y      : tile.worldY
                };
            };
        return false;    
        },
        
        isStair: function(direction) {
            for (var i in this.layers.stairs) {
                var tile = this.map.getTileWorldXY(this.player.x, this.player.bottom + 1*direction, this.map.tileWidth, this.map.tileHeight, this.layers.stairs[i].index);
                if (tile) {
                    return this.getClimbPosition(tile);
                    break;
                }
            }
            return false;
        },
        
        canClimb: function() { 
            return { up:this.isStair(-1), down:this.isStair(1) };
        },
        
        /**
         * Find goods in the current position
         * 
         * @returns {scene.prototype.isThereSomeGoods.tile|Boolean}
         */
        isThereSomeGoods: function() {
            for (var i in this.layers.goods) {
                var tile = this.map.getTileWorldXY(this.player.x, this.player.bottom - 1, this.map.tileWidth, this.map.tileHeight, this.layers.goods[i].index);
                if (tile) {
                    return tile;
                    break;
                }
            }
            return false;
        },
        
        /**
         * Find a door in the current position
         * 
         * @returns {Boolean}
         */
        isThereSomeDoor: function() {
            for (var name in this.objects.doors) {
            var gate = this.objects.doors[name],
                x2   = gate.x + gate.width,
                y2   = gate.y + gate.height,
                px   = this.player.left + this.player.width/2,
                py   = this.player.top  + this.player.height/2;
                if (px > gate.x && px < x2 && py > gate.y && py < y2)
                    return gate;
            }
            return false;
        },
        
        /**
         * Find a cover of the current position
         * 
         * @returns {Boolean}
         */
        isThereSomeCover: function(x, y, layerName) {
            var layerIndex = this.map.getLayerIndex(layerName);
            for (var i=layerIndex+1; i<this.map.layers.length; i++) {
                var tile = this.map.getTileWorldXY(x, y, this.map.tileWidth, this.map.tileHeight, i);
                if (tile) { // console.log('cover:', tile);
                    return tile;
                    break;
                }
            }
            return false;            
        },
        
        end: null
        
    };

//------------------------------------------------------------------------------
// Exports module values:
//------------------------------------------------------------------------------

module.exports = scene;
