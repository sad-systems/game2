/*==============================================================================
 *  Title      : Application
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru>
 *  Created on : 27.04.2015
 *==============================================================================
 */

var run = function () {
//------------------------------------------------------------------------------

    var sceneManager  = require('sceneManager');
    var config        = require('./application-config.js');

    var bootScene = function () {};
        bootScene.prototype = {

            preload: function() {
                //this.game.load.image('preloader', 'assets/sprites/preloader.png');
            },

            create: function() { 
                
                console.log('The game application by MrDigger (c) SAD-Systems [http://sad-systems.ru]');
                
                var game = this.game;
                //--- Add game extentions:
                game.extentions = {
                    sceneManager:sceneManager.create(game)
                };
                //--- Load & start main scene:
                var mainSceneName = config.mainSceneName;
                game.state.add  (mainSceneName, require(mainSceneName));
                game.state.start(mainSceneName);
                
            }
        };
    
    config.game.state = bootScene;

return new Phaser.Game(config.game);

//------------------------------------------------------------------------------
};
    
//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

module.exports = {
    run: run
};