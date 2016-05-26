/*==============================================================================
 *  Title      : [TITLE]
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru>
 *  Created on : 24.05.2016, 21:54:12
 *==============================================================================
 */

var 
    toolButtons    = require('toolButtons'),
    gamepadButtons = require('gamepadButtons'),
    menuScene      = 'scLogo',
    levelMaps      = {
        level1: 'tilemaps/level1'
    };
    
//------------------------------------------------------------------------------

var playerInstance = require('playerFactory').create();
var mapManager     = require('mapManager').create({maps:levelMaps});

//------------------------------------------------------------------------------

var 
    blockMass       = 100,
    blockGravity    = 300,
    blockBounce     = 0.5;

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
            
            mapManager.preload(this.game);

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
            
            //--- Map:
            this.map = mapManager.createMap();
                            
            //--- Player:
            playerInstance.create(mapManager.startPoint.x, mapManager.startPoint.y, {map:mapManager.map, layers:mapManager.layers, objects:mapManager.objects, prizes:mapManager.prizes});
            this.player = playerInstance.player;
            
            //------------------------------------------------------------------

            //--- Gamepad: -------------------

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
                                mapManager.resizeMap();
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
            game.extentions.sceneManager.setCamera(this.player);
            
            //--- Start:
            game.extentions.sceneManager.begin();
            
        },
        
        update: function() {
            
            //--- Collide the player and the platforms:
            for (var i in mapManager.layers.platforms)
                this.game.physics.arcade.collide(this.player, mapManager.layers.platforms[i], function(player, layer) {}, null, this); //platforms
            //--- Collide the player and the stairs:
            for (var i in mapManager.layers.stairs)
                this.game.physics.arcade.collide(this.player, mapManager.layers.stairs[i], function(player, layer) {}, null, this); //stairs
            //--- Collide the player and the prizes:
              //this.game.physics.arcade.collide(this.player, this.prizes, null, function(player, prize) { this.g_etPrize(prize); return false; }.bind(this),  this); //prizes
              //this.game.physics.arcade.overlap(this.player, this.prizes, function(player, prize) { this.getPrize(prize); return false; }, null, this); //prizes
            //--- Collide blocks:
                this.game.physics.arcade.collide(this.player, mapManager.blocks,
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
                this.game.physics.arcade.collide(mapManager.blocks, mapManager.blocks, null, null,  this);
            for (var i in mapManager.layers.platforms) 
                this.game.physics.arcade.collide(mapManager.blocks, mapManager.layers.platforms[i], function(player, layer) {}, null, this);

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
        
        end: null
        
    };

//------------------------------------------------------------------------------
// Exports module values:
//------------------------------------------------------------------------------

module.exports = scene;
