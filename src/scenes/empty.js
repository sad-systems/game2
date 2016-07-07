/*==============================================================================
 *  Title      : Under construction
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru>
 *  Created on : 07.07.2016
 *==============================================================================
 */

var uiManager  = require('uiManager'),
    textStyles = require('textStyles'),
    nextScene  = 'scMainMenu';

var ui;

//------------------------------------------------------------------------------
// Scene
//------------------------------------------------------------------------------

var scene = function () {}; //new Phaser.State();
scene.prototype = {
    preload: function () {
        
        //--- Static images:
        this.game.load.image('emptyBg', 'assets/bg/1/bg.jpg');
        
        //--- Atlas:
        this.game.load.atlas('dragon', 'assets/sprites/dragon/dragon.png', 'assets/sprites/dragon/dragon.json');
        
        //--- Music:
        this.game.load.audio('musichelp', 'assets/audio/track1.mp3');
        
    },
    create: function () {

        var game = this.game;
        game.extentions.audio.music.play('musichelp');

        //--- Globals:
        var globals = game.extentions.globals;
        
        //--- User Interface:
        ui = uiManager.create(game, { styles:textStyles });
        
        //--- Background:
        game.add.image(0, 0, 'emptyBg');
        
        //--- Message:
        var data = [
            {
                img:'dragon',
                options: {frame:'lovely_008.png'}
            },
            {
                label: __('The level is under construction')
            },
            {
                text: __('Please,\nlook in here later')
            },
            {
                text: __('or') + ':'
            },
            {
                link:['mailto:sad-systems@mail.ru?subject=The game idea', __('Suggest your idea')],
                options:{y:+20}
            },
            {
                link:['mailto:sad-systems@mail.ru?subject=The game new level', __('Send your level')]
            },
            {
                link:['http://sad-systems.ru#donate', __('Material support')]
            }
        ];
        ui.createGroup(data, {x:this.game.width/2, y:50, spaceY:0} );
        
        //--- Button "Back to menu":
        game.world.add(ui.createButton(__('Back'), { onDown:function(){ game.extentions.sceneManager.next(nextScene); }, x:game.width/2, y:game.height - 20, anchorY:'bottom' }));
        
        //--- Begin:
        game.extentions.sceneManager.begin();

    },
    update: function () {
    }

    //render: function() {}        
};

//------------------------------------------------------------------------------
// Exports module values:
//------------------------------------------------------------------------------

module.exports = scene;
