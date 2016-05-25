/*==============================================================================
 *  Title      : [TITLE]
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru>
 *  Created on : 24.05.2016, 21:54:12
 *==============================================================================
 */

var playerInstance = require('playerFactory').create();

//------------------------------------------------------------------------------


var basic          = require('basic'),
    toolButtons    = require('toolButtons'),
    gamepadButtons = require('gamepadButtons'),
    menuScene      = 'scLogo',
    levelMaps      = {
        level1: 'tilemaps/level1'
    },
    levelMain;

var 
    blockMass       = 100,
    blockGravity    = 300,
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

//------------------------------------------------------------------------------
// Scene
//------------------------------------------------------------------------------

var scene = function () {};
    scene.prototype = {
        
        preload: function() {
            
            // Static images:
            this.game.load.image('bg',       'assets/bg/1/sc1bg2.jpg');
            this.game.load.image('ground',   'assets/bg/1/ground.png');
            
            this.game.load.image('joystick', 'assets/sprites/controls/joystick2.png');
            this.game.load.atlas('gamepadButtons', 'assets/sprites/controls/gamepad.png', 'assets/sprites/controls/gamepad.json');
            this.game.load.atlas('toolButtons', 'assets/sprites/controls/tools.png', 'assets/sprites/controls/tools.json');
            
            // Spritesheets:
            //this.game.load.spritesheet('prizes', 'assets/sprites/tiles/prizes.png', 32, 25);
            //this.game.load.atlas('prizes',  'assets/sprites/tiles/prizes.png', 'assets/sprites/tiles/prizes.json');



            playerInstance.preload(this.game);
            
            
            // Level talemap: --------------------------------------------------
            var rootPath = 'assets/';
            if (levelMaps && typeof(levelMaps) === 'object') {
                for (var levelName in levelMaps) {
                    if (!levelMain) levelMain = levelName;
                    //console.log('level name:'+levelName+' : '+levelMaps[levelName]);
                    var levelMap = require(levelMaps[levelName]); //('../tilemaps/level1.json');
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

            //--- Background:
            //game.add.image(0, 0, 'bg');
            game.add.tileSprite(0, 0, 5000, 700, 'bg');


            //--- Create tilemap:     
            var map = this.map = game.add.tilemap(levelMain);
            //  map.setTileIndexCallback([53,54,55,56,57,58,59,60,61], this.g_etPrize, this, 'Prizes');
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
playerInstance.create(this.startPoint.x, this.startPoint.y, {map:this.map, layers:this.layers, objects:this.objects});
this.player = playerInstance.player;
            
            //------------------------------------------------------------------

            //--- Gamepad: -------------------
            var self = this;
            var gp = gamepadButtons.create({game:game, buttons:{
                Up:     { 
                            onDown:playerInstance.actionUp.bind(playerInstance), 
                              onUp:playerInstance.actionUpRelease.bind(playerInstance) 
                        },
                Down:   { 
                            onDown:playerInstance.actionDown.bind(playerInstance), 
                              onUp:playerInstance.actionDownRelease.bind(playerInstance) 
                        },
                Left:   { 
                            onDown:playerInstance.actionLeft.bind(playerInstance), 
                              onUp:playerInstance.actionLeftRelease.bind(playerInstance) 
                        },
                Right:  { 
                            onDown:playerInstance.actionRight.bind(playerInstance), 
                              onUp:playerInstance.actionRightRelease.bind(playerInstance) 
                        },
                Fire:   {
                            onDown:playerInstance.actionSpace.bind(playerInstance)
                        },
                A:      {
                            onDown:playerInstance.actionA.bind(playerInstance)
                        },
                B:      {
                            onDown:playerInstance.actionB.bind(playerInstance)
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
                        case Phaser.KeyCode.UP:       playerInstance.actionUp(); break;
                        case Phaser.KeyCode.DOWN:     playerInstance.actionDown(); break;
                        case Phaser.KeyCode.LEFT:     playerInstance.actionLeft(); break;
                        case Phaser.KeyCode.RIGHT:    playerInstance.actionRight(); break;
                        case Phaser.KeyCode.SPACEBAR: playerInstance.actionSpace(); break;
                        case Phaser.KeyCode.ALT:      playerInstance.actionA(); break;
                        case Phaser.KeyCode.CONTROL:  playerInstance.actionB(); break;
                    }
                }, 
                //--- On key up:
                function(KeyboardEvent) {
                      switch (KeyboardEvent.keyCode) {
                        case Phaser.KeyCode.UP:       playerInstance.actionUpRelease(); break;
                        case Phaser.KeyCode.DOWN:     playerInstance.actionDownRelease(); break;
                        case Phaser.KeyCode.LEFT:     playerInstance.actionLeftRelease(); break;
                        case Phaser.KeyCode.RIGHT:    playerInstance.actionRightRelease(); break;
                    }
                }
            );
                            
            //--- Tools button:---------------
            var tb = toolButtons.create({game:game, x:10, y:10, buttons:{
                Fullscreen:{ state:game.scale.isFullScreen, onDown:function(o) { 
                                game.extentions.sceneManager.gotoFullScreen();
                                this.resizeGame();
                                this.setCamera();
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
            this.setCamera();
            
            //--- Start:
            game.extentions.sceneManager.begin();
            
            
        },
        
        setCamera: function() {
            //--- Set camera:
            this.game.camera.follow(this.player);
            //var h = 160;
            //this.game.camera.deadzone = new Phaser.Rectangle(this.game.camera.width/2, h, 0, this.game.camera.height - h*2);
            var x = this.game.camera.width*0.2,  // %
                y = this.game.camera.height*0.2; // %    
            this.game.camera.deadzone = new Phaser.Rectangle(x, y, this.game.camera.width - x*2, this.game.camera.height - y*2);
        },
        
        update: function() {
            
            //--- Collide the player and the platforms:
            for (var i in this.layers.platforms)
                this.game.physics.arcade.collide(this.player, this.layers.platforms[i], function(player, layer) {}, null, this); //platforms
            //--- Collide the player and the stairs:
            for (var i in this.layers.stairs)
                this.game.physics.arcade.collide(this.player, this.layers.stairs[i], function(player, layer) {}, null, this); //stairs
            //--- Collide the player and the prizes:
              //this.game.physics.arcade.collide(this.player, this.prizes, null, function(player, prize) { this.g_etPrize(prize); return false; }.bind(this),  this); //prizes
                this.game.physics.arcade.overlap(this.player, this.prizes, function(player, prize) { this.getPrize(prize); return false; }, null, this); //prizes
            //--- Collide blocks:
                this.game.physics.arcade.collide(this.player, this.blocks,
                    function(player, block) {
                        if (player.body.velocity.x > 0 && player.body.touching.right) { 
                            player.body.velocity.x = playerInstance.velocityMove;
                        } else 
                        if (player.body.velocity.x < 0 && player.body.touching.left) {
                            player.body.velocity.x = -playerInstance.velocityMove;
                        }
                        block.body.velocity.x = 0; 
                    },
                    null,
                    this
                );
                this.game.physics.arcade.collide(this.blocks, this.blocks, null, null,  this);
            for (var i in this.layers.platforms)
                this.game.physics.arcade.collide(this.blocks, this.layers.platforms[i], function(player, layer) {}, null, this);

            //--- Player:
            playerInstance.update();

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
        
        resizeGame: function () {
            for(var i in this.layers.all) {
                this.layers.all[i].resize(this.game.width, this.game.height);
            }
        },
        
        
        /*
        clearTile: function(tile) {
            tile.index = 0;
            tile.alpha = 0;
            //tile.destroy();
            tile.layer.dirty = true;
        },
        */    
            
        
        /*
        changeTile: function(tile, index) {
            //console.log(tile);
            tile.index = index;
            //tile.destroy();
            tile.layer.dirty = true;
        },
        */
        
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
