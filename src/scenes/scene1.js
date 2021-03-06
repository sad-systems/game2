/*==============================================================================
 *  Title      : Action Scene 1
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru>
 *  Created on : 24.05.2016, 21:54:12 
 *==============================================================================
 */

var 
    menuScene      = 'scMainMenu', //'scLogo',
    levelMaps      = {
        s1_1:      'tilemaps/s1_1',
        s1_house1: 'tilemaps/s1_house1',
        s1_house2: 'tilemaps/s1_house2',
        s1_house3: 'tilemaps/s1_house3',
        s1_house4: 'tilemaps/s1_house4'
    },
    gameControls   = require('gameControls'),
    playerInstance = require('playerFactory').getInstance(),
    mapManager     = require('mapManager').create({maps:levelMaps}),
    stateStorage   = require('stateStorage').getInstance({currentSceneName:'scene1'});

//------------------------------------------------------------------------------
// Scene
//------------------------------------------------------------------------------

var scene = function () {};
    scene.prototype = {
        
        preload: function() {
            
            // Static images:
            this.game.load.image('background', 'assets/bg/1/sc1bg.jpg');
            
            //--- Game controls:
            gameControls.preload(this.game);
            
            //--- Player:
            playerInstance.preload(this.game);
            //--- Map:
            mapManager.preload(this.game);
            
            //--- Music & Sounds:
            this.game.load.audio('track2',      'assets/audio/track2.mp3');
            this.game.load.audio('soundforest', 'assets/audio/forest.mp3');

        },
        
        create: function() {

            //--- Music & Sounds:
            this.game.extentions.audio.music.stop(); //<--- stop all music
            this.game.extentions.audio.music.play('track2', true, 0.5);
            this.game.extentions.audio.sound.play('soundforest', 2, 0.25);
            
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
