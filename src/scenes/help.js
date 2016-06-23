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
        
        //--- Modify text styles:
        Phaser.Utils.extend(true, ui.styles.text,      { align:'left', fontSize:'18px' });
        Phaser.Utils.extend(true, ui.styles.smallText, { align:'left', fontSize:'14px' });
        
        //--- Help sections:
        var sections = [
            this.craeteHelp1(10, 10),
            this.craeteHelp2(10, 10),
            this.craeteHelp3(10, 10)
        ];
        
        //--- Create help sections pagination:
        this.createSections(sections, game.width -10, game.height -10);
        
        //--- Button "Back to menu":
        game.world.add(ui.createButton(__('Back'), { onDown:function(){ game.extentions.sceneManager.next('scMainMenu'); }, x:10, y:game.height - 10, anchorX:'left', anchorY:'bottom' }));
        
        //--- Common controls:
        //controls.create(this.game);
        //controls.onResize = function() {
        //};
        
    },
    
    //==========================================================================
    // HELP animations
    //==========================================================================
    
    hidePage: function(group, mode) {
        var t = this.game.add.tween(group), 
            x;
            group.x = 10;
        if (mode == 0) { 
            //--- Move to the right:
            x = this.game.width;
        } else {
            //--- Move to the left:
            x = -this.game.width;
        }
        //t.onComplete.addOnce(onComplete, this);
        t.to( { x: x }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
    },
    
    showPage: function(group, mode) {
            group.visible = true; 
            var t = this.game.add.tween(group),
                x = 10;
        if (mode == 0) {
            //--- Move to the right:
            group.x       = -this.game.width;
        } else {
            //--- Move to the left:
            group.x       = this.game.width;
        }
        //t.onComplete.addOnce(onComplete, this);
        t.to( { x: 10 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
    },
    
    createSections: function(sections, x, y, currentSection) {
        
        if (!sections || sections.length < 2) return;
        
        currentSection = currentSection || 0;
        
        var self = this;
        
        var showSection   = function(id, mode) {
            self.showPage(sections[id], mode);
        };
        var hideSection   = function(id, mode) {
            self.hidePage(sections[id], mode);
        };
        var changeSection = function(id) {
            if (currentSection < id) {
                hideSection(currentSection, 1);
                showSection(id, 1);
            }
            if (currentSection > id) {
                hideSection(currentSection, 0);
                showSection(id, 0);
            }
            currentSection = id;
        };
        
        var pageButtonsGroup   = this.game.add.group();
            pageButtonsGroup.x = x;
            pageButtonsGroup.y = y;
            
        var xx = 0,
            yy = 0;
    
        for (var i = sections.length-1; i>-1; i--) {
            
            var button = function (i) {
                return ui.createButton( i+1, {onDown:function() { changeSection(i); }, x:xx, y:yy, anchorX:'right', anchorY:'bottom' } );
            }(i);
                
            xx -= (button.width); 
            pageButtonsGroup.add(button);
            
            //--- Hide all help sections except current:
            if (i == currentSection) continue;
            sections[i].visible = false;
        }
        
        pageButtonsGroup.add(ui.createLabel( __('Pages') + ':', { x:xx, y:yy, anchorX:'right', anchorY:'bottom' } ));
      
    },
    
    //==========================================================================
    // HELP Docs
    //==========================================================================
    
    craeteHelp1: function (x, y) {
        
        var descX = 240;
        var data  = [
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
                options: {frame:'joystick.png', x:140, y:-80, anchorX:'left', scale:{x:0.45, y:0.45} }
            },  
            {
                text: __('_Move_'),
                options:{ x:descX, y:-55 }
            },
            {
                img:'keyboard',
                options: {frame:'Alt', x:30, y:+10}
            },
            {
                img:'mobilepadButtons',
                options: {frame:'hand.png', x:140 + 10, y:-55, anchorX:'left', scale:{x:0.5, y:0.5} }
            },            
            {
                text: __('_Alt_'),
                options:{ x:descX, y:-55 }
            },
            {
                img:'keyboard',
                options: {frame:'Space-' + this.game.extentions.globals.lang, y:+5}
            },
            {
                img:'toolButtons',
                options: {frame:'FireReady.png', x:140 + 10, y:-50, anchorX:'left',  }
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
        
        return ui.createGroup(data, {x:x, y:y, spaceY:10} );
        
    },
    
    craeteHelp2: function (x, y) {
        
        var descX = 80,
            deskY = -45;
        
        var data = [
            {
                label: __('_Tools_'),
                options:{ x: this.game.width/2, anchorX:'center' }
            },
            { img:'toolButtons', options: {frame:'Settings.png'} },
            { text: __('_Settings_'), options: { x:descX, y:deskY } },
            { img:'toolButtons', options: {frame:'Menu.png'} },
            { text: __('_Menu_'), options: { x:descX, y:deskY } },
            { img:'toolButtons', options: {frame:'Fullscreen.png'} },
            { text: __('_Fullscreen_'), options: { x:descX, y:deskY } },
            { img:'toolButtons', options: {frame:'Gamepad.png'} },
            { text: __('_Gamepad_'), options: { x:descX, y:deskY } },
            { img:'toolButtons', options: {frame:'Music.png'} },
            { text: __('_Music_'), options: { x:descX, y:deskY } },
            { img:'toolButtons', options: {frame:'Sound.png'} },
            { text: __('_Sound_'), options: { x:descX, y:deskY } }
            
        ];
        
        return ui.createGroup(data, {x:x, y:y, spaceY:10} );
        
    },
    
    craeteHelp3: function (x, y) {
        
        var descX = 240;
        
        var data = [
            {
                label: __('_The_goal_'),
                options:{ x: this.game.width/2, anchorX:'center' }
            },
            { text: __('_The_goal_text_'), options: {} }
            
        ];
        
        return ui.createGroup(data, {x:x, y:y, spaceY:10} );
        
    }
  
};

//------------------------------------------------------------------------------
// Exports module values:
//------------------------------------------------------------------------------

module.exports = scene;
