/*==============================================================================
 *  Title      : Action Scene 1
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru>
 *  Created on : 24.05.2016, 21:54:12 
 *==============================================================================
 */

var 
    menuScene      = 'scLogo',
    levelMaps      = {
        level1: 'tilemaps/level1'
    },
    gameControls   = require('gameControls'),
    playerInstance = require('playerFactory').create(),
    mapManager     = require('mapManager').create({maps:levelMaps});

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

        },
        
        create: function() {

            //--- Background:
            var bg = this.game.add.tileSprite(0, 0, 5000, 700, 'background');
                bg.fixedToCamera = true;
            
            //--- Create Map:
            mapManager.createMap();
                            
            //--- Create Player:
            playerInstance.create(mapManager.startPoint.x, mapManager.startPoint.y, {mapManager:mapManager});
            
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
