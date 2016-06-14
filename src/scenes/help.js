/*==============================================================================
 *  Title      : Help scene
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru>
 *  Created on : 14.06.2016
 *==============================================================================
 */

var controls    = require('mainControls'),
    menu        = require('textMenu'),
    toolButtons = require('toolButtons');

//------------------------------------------------------------------------------
// Scene
//------------------------------------------------------------------------------

var scene = function () {};
scene.prototype = {
    
    //--------------------------------------------------------------------------
    preload: function () {
        
        //--- Static images:
        this.game.load.image('helpBg', 'assets/bg/title/bg.jpg');
        //--- Common controls:
        controls.preload(this.game);

    },
    
    //--------------------------------------------------------------------------
    create: function () {

        var game = this.game;
        game.extentions.sceneManager.begin();

        game.add.image(0, 0, 'helpBg');
        
        //--- Common controls:
        controls.create(this.game);
        controls.onResize = function() {
        };
        
    }
  
};

//------------------------------------------------------------------------------
// Exports module values:
//------------------------------------------------------------------------------

module.exports = scene;
