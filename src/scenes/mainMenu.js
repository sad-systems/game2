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
        this.game.load.image('mrdigger', 'assets/bg/intro/mrdigger.png');
        this.game.load.image('circle',   'assets/bg/intro/circle.png');
        //--- Common controls:
        controls.preload(this.game);

    },
    
    //--------------------------------------------------------------------------
    create: function () {

        var game = this.game;
        game.extentions.sceneManager.begin();

        game.add.image(0, 0, 'menuBg');
        
        var title = this.title = game.add.image(this.game.camera.view.centerX, 0, 'title2');
            title.y = 0 - title.height/2;
            title.anchor.set(0.5);
        
        //--- Main menu:
        var mainMenu = this.mainMenu = menu.create(this.game, {
            y : this.game.height,
            items: [
                {text: 'New game',    onDown:function(o){ game.extentions.sceneManager.next('scene1'); } },
                {text: 'Resume',      disable:true, onDown:function(o){ game.extentions.sceneManager.next('scene1'); } },
                {text: 'Options',     onDown:this.showOptions.bind(this) },
                {text: 'Help',        onDown:function(o){ game.extentions.sceneManager.next('scHelp'); } },
                {text: 'Credits',     onDown:this.showCredits.bind(this) }
            ]
        });
        
        //--- Options menu:
        var optionsMenu = this.createOptions();
        
        //--- Credits menu:
        var creditsMenu = this.createCredits();     
        
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
            this.twCredits.to( { y: 10 }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
            
        }.bind(this));       
    },    
    
    hideCredits: function() {

        this.twCreditsMenu = this.game.add.tween(this.creditsMenu.group);
        this.twCreditsMenu.onComplete.addOnce(function() { this.showTitle(); this.showMainMenu(); }, this);
        this.twCreditsMenu.to( { y: this.game.height }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
        
    },     
    
    styles: {
        
        label: {
            fill            : '#ffd801',
            stroke          : '#bb9c2e',// '#296e2d',
            strokeThickness : 5,
            shadowOffsetX   : 3,
            shadowOffsetY   : 3,
            shadowFill      : true,
            shadowBlur      : 3,
            shadowColor     : 'rgba(0,0,0,0.5)'
        }
    },
    
    setStyle: function(obj, styleName) {
        var style = this.styles[styleName];
        for (var i in style) {
            obj[i] = style[i];
        }
    }, 
    
    createLabel: function (x, y, text) {
        var label = this.game.make.text(x, y, text);
            label.anchor.set(0.5, 0);
        this.setStyle(label, 'label');
        return label;
    },
    
    createOptions: function () {
        
        var self = this;
        
        function createButton(x, y, name) {
            var bt = self.game.make.button(x, y, 'toolButtons', null, this, name+'.png', name+'.png', name+'.png');
                bt._alpha = 0.75;
                bt.alpha = bt._alpha;
                bt.onInputOver.add(function(o){ o.alpha = 1; });
                bt.onInputOut.add (function(o){ o.alpha = o._alpha; });
                //bt.onInputOver.add(function(o){ o.blendMode = PIXI.blendModes.SCREEN; });
                //bt.onInputOut.add (function(o){ o.blendMode = PIXI.blendModes.NORMAL; });
                //bt.onInputDown.add(button.onDown);
            return bt;    
        };
        
        //--- Options menu:
        var optionsMenu     = this.optionsMenu = {};
        optionsMenu.group   = this.game.add.group();
        optionsMenu.group.x = this.game.camera.view.centerX;
        optionsMenu.group.y = this.game.height;
        //--- Game control:
        optionsMenu.group.add(this.createLabel(0, 0, 'Game control:'));
        optionsMenu.group.add(createButton(-75, 40, 'Gamepad'));
        optionsMenu.group.add(createButton(-25, 40, 'Gamepad2'));
        optionsMenu.group.add(createButton( 25, 40, 'Keyboard'));
        //--- Button back:
        var btBack = menu.create(this.game, {
            x : 0, 
            y : 180,
            items: [ {text: 'Back', onDown:this.hideOptions.bind(this) } ]
        });        
        optionsMenu.group.add(btBack.group);
        
        return optionsMenu;
        
    },
    
    createCredits: function() {
        //--- Credits menu:
        var creditsMenu     = this.creditsMenu = {};
        creditsMenu.group   = this.game.add.group();
        creditsMenu.group.x = this.game.camera.view.centerX;
        creditsMenu.group.y = this.game.height;
        //---
        var img = this.game.make.image(5, 75, 'circle');
            img.anchor.set(0.5);
        creditsMenu.group.add(img);
        var img = this.game.make.image(0, 70, 'mrdigger');
            img.anchor.set(0.5);
        creditsMenu.group.add(img);
        //--- Button back:
        var btBack = menu.create(this.game, {
            x : 0,
            y : this.game.height - 80,
            items: [ {text: 'Back', onDown:this.hideCredits.bind(this) } ]
        });   
        creditsMenu.group.add(btBack.group);
        
        return creditsMenu;
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
