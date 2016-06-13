/*==============================================================================
 *  Title      : Title scene
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru>
 *  Created on : 28.04.2016, 16:58:12
 *==============================================================================
 */

var nextScene = 'scMainMenu',
    controls  = require('mainControls');

//------------------------------------------------------------------------------
// Scene
//------------------------------------------------------------------------------

var scene = function () {};
scene.prototype = {
    
    //--------------------------------------------------------------------------
    preload: function () {
        
        //--- Static images:
        this.game.load.image('titleBg', 'assets/bg/title/bg.jpg');
        this.game.load.image('title1',  'assets/bg/title/1.png');
        //--- Common controls:
        controls.preload(this.game);
        
    },
    
    //--------------------------------------------------------------------------
    create: function () {

        var game = this.game;
        game.extentions.sceneManager.begin();

        game.add.image(0, 0, 'titleBg');

        //--- Common controls:
        controls.create(this.game);
        controls.onResize = function() {};
        
    },
    
    //--------------------------------------------------------------------------
    update: function () {
    }

    //render: function() {}        
};

//------------------------------------------------------------------------------
// Exports module values:
//------------------------------------------------------------------------------

module.exports = scene;
