/*==============================================================================
 *  Title      : Title scene
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru>
 *  Created on : 28.04.2016, 16:58:12
 *==============================================================================
 */

//------------------------------------------------------------------------------
// Scene
//------------------------------------------------------------------------------

var scene = function () {}; //new Phaser.State();
scene.prototype = {
    
    //--------------------------------------------------------------------------
    preload: function () {
        
        // Static images:
        this.game.load.image('titleBg', 'assets/bg/title/bg.jpg');
        this.game.load.image('title1',  'assets/bg/title/1.png');
        
        //--- Test:
        //this.game.load.image('big1',  'assets/sprites/big1.jpg');
        //this.game.load.image('big2',  'assets/sprites/big2.jpg');
        //this.game.load.image('big3',  'assets/sprites/big3.jpg');
        //this.game.load.image('big4',  'assets/sprites/big4.jpg');

        // Static Spritesheet:
        //this.game.load.spritesheet('dragon', 'assets/sprites/dragon/dragon.png', 50, 50);
        // Atlas:
        //this.game.load.atlas ('dragon', 'assets/sprites/dragon/dragon.png', 'assets/sprites/dragon/dragon.plist'); //, null, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);
    },
    
    //--------------------------------------------------------------------------
    create: function () {

        var game = this.game;
        game.extentions.sceneManager.begin();

        game.add.image(0, 0, 'titleBg');

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
