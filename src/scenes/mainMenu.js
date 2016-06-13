/*==============================================================================
 *  Title      : Main menu scene
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru>
 *  Created on : 13.06.2016
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
        this.game.load.image('menuBg', 'assets/bg/title/bg.jpg');
        this.game.load.image('title2', 'assets/bg/title/title-en.png');
        //this.game.load.image('title2', 'assets/bg/title/title-ru.png');
        //--- Common controls:
        controls.preload(this.game);

    },
    
    //--------------------------------------------------------------------------
    create: function () {

        var game = this.game;
        game.extentions.sceneManager.begin();

        game.add.image(0, 0, 'menuBg');
        
        var title = this.title = game.add.image(this.game.camera.view.centerX, 0, 'title2');
            title.y = 0 - title.height/2; //title.height/2 + title.height*0.1;
            title.anchor.set(0.5);
        
        //--- Main menu:
        var mainMenu = this.mainMenu = menu.create(this.game, {
            y : this.game.height,
            items: [
                {text: 'New game',    onDown:function(o){ game.extentions.sceneManager.next('scene1'); } },
                {text: 'Resume',      disable:true, onDown:function(o){ game.extentions.sceneManager.next('scene1'); } },
                {text: 'Options',     onDown:this.showOptions.bind(this) },
                {text: 'Help',        onDown:this.showHelp.bind(this) },
                {text: 'Credits',     onDown:this.showCredits.bind(this) }
            ]
        });
        
        //--- Options menu:
        var optionsMenu = this.optionsMenu = menu.create(this.game, {
            y : this.game.height,
            items: [
                //{text: 'Sound'   },
                //{text: 'Music'   },
                {text: 'Gamepad' },
                {text: 'Done', onDown:this.hideOptions.bind(this) }
            ]
        });
        
        //--- Credits menu:
        var creditsMenu = this.creditsMenu = menu.create(this.game, {
            y : this.game.height,
            items: [
                {text: 'Done', onDown:this.hideCredits.bind(this) }
            ]
        });        
        
        //--- Help menu:
        var helpMenu = this.helpMenu = menu.create(this.game, {
            y : this.game.height,
            items: [
                {text: 'Done', onDown:this.hideHelp.bind(this) }
            ]
        });        
        
        //--- Animations:
            this.showMainMenu(null, 1000);
            this.showTitle(1000);
        
        //--- Tools buttons:
        var tb = toolButtons.create({game:game, x:10, y:10,
            leftSide: false,
            frameControlName : null,
            buttons:{
                Music: { state:0, onDown:function(o){ o.setState(!o.state); console.log('Music: ' + o.state); } },
                Sound: { state:0, onDown:function(o){ o.setState(!o.state); console.log('Sound: ' + o.state); } }
            }
        });
        
        //--- Common controls:
        controls.create(this.game);
        controls.onResize = function() {
            mainMenu.group.x    = game.camera.view.centerX;
            optionsMenu.group.x = game.camera.view.centerX;
            creditsMenu.group.x = game.camera.view.centerX;
            helpMenu.group.x    = game.camera.view.centerX;
            title.x             = game.camera.view.centerX;
            tb.refresh();
        };
        
    },
    
    hideMainMenu: function (onComplete, time) {
        this.twMainMenu = this.game.add.tween(this.mainMenu.group);
        if (onComplete) this.twMainMenu.onComplete.addOnce(onComplete, this);
        this.twMainMenu.to( { y: this.game.camera.height }, time || 500, Phaser.Easing.Linear.None, true, 0, 0, false);
    },
    
    showMainMenu: function (onComplete, time) {
        this.twMainMenu = this.game.add.tween(this.mainMenu.group);
        if (onComplete) this.twMainMenu.onComplete.addOnce(onComplete, this);
        this.twMainMenu.to( { y: this.game.camera.view.centerY }, time || 500, Phaser.Easing.Linear.None, true, 0, 0, false);
    },

    showTitle: function (time) {
        this.twTitle = this.game.add.tween(this.title);
        this.twTitle.to( { y: this.title.height/2 + this.title.height*0.1 }, time || 500, Phaser.Easing.Linear.None, true, 0, 0, false);
    },
    
    hideTitle: function (time) {
        this.twTitle = this.game.add.tween(this.title);
        this.twTitle.to( { y: 0 - this.title.height/2 }, time || 500, Phaser.Easing.Linear.None, true, 0, 0, false);
    },    

    showOptions: function() {
        this.hideMainMenu(function(){
            
            this.twOptionsMenu = this.game.add.tween(this.optionsMenu.group);
            this.twOptionsMenu.to( { y: this.game.camera.view.centerY }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
            
        }.bind(this));       
    },
    
    hideOptions: function() {

        this.twOptionsMenu = this.game.add.tween(this.optionsMenu.group);
        this.twOptionsMenu.onComplete.addOnce(function() { this.showMainMenu(); }, this);
        this.twOptionsMenu.to( { y: this.game.height }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
        
    },    
    
    showCredits: function() {
        this.hideTitle();
        this.hideMainMenu(function(){
            
            this.twCredits = this.game.add.tween(this.creditsMenu.group);
            this.twCredits.to( { y: this.game.camera.view.centerY }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
            
        }.bind(this));       
    },    
    
    hideCredits: function() {

        this.twCreditsMenu = this.game.add.tween(this.creditsMenu.group);
        this.twCreditsMenu.onComplete.addOnce(function() { this.showTitle(); this.showMainMenu(); }, this);
        this.twCreditsMenu.to( { y: this.game.height }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
        
    },     
    
    showHelp: function() {
        this.hideTitle();
        this.hideMainMenu(function(){
            
            this.twHelp = this.game.add.tween(this.helpMenu.group);
            this.twHelp.to( { y: this.game.camera.view.centerY }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
            
        }.bind(this));       
    }, 
    
    hideHelp: function() {

        this.twHelpMenu = this.game.add.tween(this.helpMenu.group);
        this.twHelpMenu.onComplete.addOnce(function() { this.showTitle(); this.showMainMenu(); }, this);
        this.twHelpMenu.to( { y: this.game.height }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
        
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
