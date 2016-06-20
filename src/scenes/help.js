/*==============================================================================
 *  Title      : Help scene
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru>
 *  Created on : 14.06.2016
 *==============================================================================
 */

var controls    = require('mainControls'),
    uiManager   = require('uiManager'),
    textStyles  = require('textStyles');

var ui;

//------------------------------------------------------------------------------
// Scene
//------------------------------------------------------------------------------

var scene = function () {};
scene.prototype = {
    
    //--------------------------------------------------------------------------
    preload: function () {
        
        //--- Static images:
        this.game.load.image('helpBg', 'assets/bg/title/bg.jpg');
        //--- Atlas:
        this.game.load.atlas('keyboard', 'assets/sprites/help/keyboardbuttons.png', 'assets/sprites/help/keyboardbuttons.json');
        this.game.load.atlas('dragon', 'assets/sprites/dragon/dragon.png', 'assets/sprites/dragon/dragon.json');
        this.game.load.atlas('toolButtons', 'assets/sprites/controls/tools.png', 'assets/sprites/controls/tools.json');
        this.game.load.atlas('mobilepadButtons',  'assets/sprites/controls/mpad1.png', 'assets/sprites/controls/mpad1.json');
        //--- Common controls:
        controls.preload(this.game);
        //--- Music & Sounds:
        this.game.load.audio('musichelp', 'assets/audio/track1.mp3');


    },
    
    //--------------------------------------------------------------------------
    create: function () {

        var game = this.game;
        game.extentions.audio.music.play('musichelp');
        game.extentions.sceneManager.begin();

        game.add.image(0, 0, 'helpBg');

        //--- User Interface:
        ui = uiManager.create(game, { styles:textStyles, anchorX:'left' });
        
        //--- Help section:
        var groupHelp = this.craeteHelp();
        
        //--- Button "Back to menu":
        game.world.add(ui.createButton(__('Back'), { onDown:function(){ game.extentions.sceneManager.next('scMainMenu'); }, x:10, y:game.height - 10, anchorX:'left', anchorY:'bottom' }));
        
        //--- Common controls:
        //controls.create(this.game);
        //controls.onResize = function() {
        //};
        
    },
    
    //==========================================================================
    // HELP
    //==========================================================================
    
    craeteHelp: function () {
        
        Phaser.Utils.extend(true, ui.styles.text,      { align:'left', fontSize:'18px' });
        Phaser.Utils.extend(true, ui.styles.smallText, { align:'left', fontSize:'14px' });
        
        var descX = 240;
        
        var data = [
            {
                img:'dragon',
                options: {frame:'lovely_008.png'}
            },
            {
                text: __('_Main_character_'),
                options:{ x:70, y:-50 }
            },
            {
                label: __('Controls'),
                options:{ x: this.game.width/2, anchorX:'center' }
            },
            {
                img:'keyboard',
                options: {frame:'Arrows'}
            },
            {
                img:'mobilepadButtons',
                options: {frame:'joystick.png', x:140, y:-80, anchorX:'left', scale:{x:0.5, y:0.5} }
            },  
            {
                text: __('_Move_'),
                options:{ x:descX, y:-55 }
            },
            {
                img:'keyboard',
                options: {frame:'Alt', x:30}
            },
            {
                img:'mobilepadButtons',
                options: {frame:'hand.png', x:140 + 15, y:-45, anchorX:'left', scale:{x:0.5, y:0.5} }
            },            
            {
                text: __('_Alt_'),
                options:{ x:descX, y:-55 }
            },
            {
                img:'keyboard',
                options: {frame:'Space-' + this.game.extentions.globals.lang}
            },
            {
                img:'toolButtons',
                options: {frame:'Fire.png', x:140 + 15, y:-45, anchorX:'left',  }
            },
            {
                text: __('_Space_'),
                options:{ x:descX, y:-45 }
            },
            { img:'toolButtons', options: {frame:'Star.png'} },
            { img:'toolButtons', options: {frame:'Default.png', x:50,  y:-60} },
            { img:'toolButtons', options: {frame:'Default.png', x:100, y:-60} },
            { img:'toolButtons', options: {frame:'Default.png', x:150, y:-60} },
            {
                text: __('_Arsenal_'),
                options:{ x:descX, y:-60 }
            },
            
            
        ];
        
        return ui.createGroup(data, {x:10, y:10, spaceY:10} );
        
    }
  
};

//------------------------------------------------------------------------------
// Exports module values:
//------------------------------------------------------------------------------

module.exports = scene;
