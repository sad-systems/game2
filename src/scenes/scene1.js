/*==============================================================================
 *  Title      : Action Scene 1
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru>
 *  Created on : 24.05.2016, 21:54:12 
 *==============================================================================
 */

var 
    menuScene      = 'scMainMenu', //'scLogo',
    levelMaps      = {
        level5: 'tilemaps/level5',
        level2: 'tilemaps/level2',
        level3: 'tilemaps/level3',
        level4: 'tilemaps/level4',
        level1: 'tilemaps/level1'
    },
    gameControls   = require('gameControls'),
    playerInstance = require('playerFactory').create(),
    mapManager     = require('mapManager').create({maps:levelMaps}),
    stateStorage   = require('stateStorage').getInstance({currentSceneName:'scene1'});

//------------------------------------------------------------------------------
// Scene
//------------------------------------------------------------------------------

var scene = function () {};
    scene.prototype = {
        
        preload: function() {
            
            // Static images:
            this.game.load.image('background', 'assets/bg/1/sc1bg2.jpg');
            
            //--- Game controls:
            gameControls.preload(this.game);
            
            //--- Player:
            playerInstance.preload(this.game);
            //--- Map:
            mapManager.preload(this.game);
            
            //--- Music & Sounds:
            //this.game.load.audio('music1',      'assets/audio/track1.mp3');
            this.game.load.audio('soundforest', 'assets/audio/forest.mp3');

        },
        
        create: function() {

            //--- Music & Sounds:
            this.game.extentions.audio.music.stop(); //<--- stop all music
            //this.game.extentions.audio.music.play('music1', true, 0.5);
            this.game.extentions.audio.sound.play('soundforest', 2);
            
            //--- Background:
            var bg = this.game.add.tileSprite(0, 0, 5000, 700, 'background');
                bg.fixedToCamera = true;
            
            //--- Create Map:
            mapManager.createMap();
                            
            //--- Create Player:
            playerInstance.create(mapManager.startPoint.x, mapManager.startPoint.y, {mapManager:mapManager});
            
            //playerInstance.events.on('apply', function(name){ console.log('applied: '+name); });
            
            //--- Create controls:
            gameControls.create(this.game, playerInstance, mapManager, menuScene);

            //--- Set camera:
            this.game.extentions.sceneManager.setCamera(playerInstance.player);
            //--- Start:
            this.game.extentions.sceneManager.begin();
            
        },
        
        update: function() {

            //--- Player:
            playerInstance.update();
            //--- Map:
            mapManager.update();

        },
        
        render: function () {}
        
    };

//------------------------------------------------------------------------------
// Exports module values:
//------------------------------------------------------------------------------

module.exports = scene;
