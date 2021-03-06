/*==============================================================================
 *  Title      : Application
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru>
 *  Created on : 27.04.2015
 *==============================================================================
 */

var run = function () {
//------------------------------------------------------------------------------

    var config        = require('./application-config.js'),
        globals       = require('globals'),
        sceneManager  = require('sceneManager'),
        audioManager  = require('audioManager');
    
    //--- Load global data:
    globals.load();
    
    //--- Set language:
    switch (globals.get('lang')) {
        case 'ru': window.__messages = require('./lang/ru/messages');
            break;
        default:   window.__messages = require('./lang/en/messages');  
    }
    //--- Translate global function: 
    window.__ = function(text) { return window.__messages[text] ? window.__messages[text] : text; };
    //----------------

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
                    sceneManager: sceneManager.create(game),
                    globals:      globals,
                    audio:        audioManager.create(game, { musicEnable:globals.get('musicEnable'), soundEnable:globals.get('soundEnable') })
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