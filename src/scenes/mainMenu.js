/*==============================================================================
 *  Title      : Main menu scene
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru>
 *  Created on : 13.06.2016
 *==============================================================================
 */

var controls    = require('mainControls'),
    uiManager   = require('uiManager'),
    textStyles  = require('textStyles'),
    toolButtons = require('toolButtons'),
    cookies     = require('cookies');

var ui;

//------------------------------------------------------------------------------
// Scene
//------------------------------------------------------------------------------

var scene = function () {};
scene.prototype = {
    
    //--------------------------------------------------------------------------
    preload: function () {
        
        var globals = this.game.extentions.globals;
        
        //--- Static images:
        this.game.load.image('menuBg', 'assets/bg/title/bg.jpg');
        this.game.load.image('title2', 'assets/bg/title/title-' + globals.lang + '.png');
        this.game.load.image('mrdigger', 'assets/bg/intro/mrdigger.png');
        this.game.load.image('circle',   'assets/bg/intro/circle.png');
        
        //--- Common controls:
        controls.preload(this.game);

    },
    
    //--------------------------------------------------------------------------
    create: function () {

        var game    = this.game,
            globals = game.extentions.globals;
        
        game.extentions.sceneManager.begin();

        game.add.image(0, 0, 'menuBg');
        
        ui = uiManager.create(game, { styles:textStyles });
        
        var title = this.title = game.add.image(this.game.camera.view.centerX, 0, 'title2');
            title.y = 0 - title.height/2;
            title.anchor.set(0.5);
        
        //--- Main menu:
        var mainMenu = this.mainMenu = {};
        var data = [
                {button: __('New game'), options: { onDown:function(o){ game.extentions.sceneManager.next('scene1'); } } },
                {button: __('Resume'),   options: { disable:true, onDown:function(o){ game.extentions.sceneManager.next('scene1'); } } },
                {button: __('Options'),  options: { onDown:this.showOptions.bind(this) } },
                {button: __('Help'),     options: { onDown:function(o){ game.extentions.sceneManager.next('scHelp'); } } },
                {button: __('Credits'),  options: { onDown:this.showCredits.bind(this) } }
        ];
        mainMenu.group = ui.createGroup( data, {spaceY:5, x:this.game.camera.view.centerX, y:this.game.height} );
        
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
                Music: { state:globals.musicEnable, onDown:function(o){ o.setState(!o.state); globals.musicEnable = o.state; } },
                Sound: { state:globals.soundEnable, onDown:function(o){ o.setState(!o.state); globals.soundEnable = o.state; } }
            }
        });
        
        //--- Language button:
        function changeLang() {
            cookies.create('language', globals.lang == 'en' ? 'ru' : 'en', 30);
            document.location.reload();
        };
        this.game.world.add(ui.createButton('', { onDown:changeLang, x:87, y:10, img: {frame: (globals.lang == 'en' ? 'Russian.png' : 'English.png'), key:'toolButtons'} }));
        
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
    
    //==========================================================================
    // Options
    //==========================================================================

    createOptions: function () {
        
        var globals = this.game.extentions.globals;
        
        //--- Options menu:
        var optionsMenu = this.optionsMenu = {};
        var group       = optionsMenu.group = this.game.add.group(),
            y,
            radioButtons;        
        group.x = this.game.camera.view.centerX;
        group.y = this.game.height;

        //--- Game control:
        group.add(ui.createLabel(__('Game control')+':'));
        
        function selectOption(button) {
            for(var i in radioButtons) radioButtons[i].setState(0);
            button.setState(1);
            setStateForId(button.options.id, 1);
        }
        
        function setStateForId(id, state) {
            globals.gameControl = id;
            return state;
        }
        
        function getStateForId(id) {
            return globals.gameControl == id ? 1 : 0;
        }

        y = group.height;
        radioButtons = [
            ui.createButton('', {id:1, state:getStateForId(1), x:-55, y:y, img:{frame:'Gamepad.png',  key:'toolButtons'}, onDown:selectOption }),
            ui.createButton('', {id:2, state:getStateForId(2), x:  0, y:y, img:{frame:'Gamepad2.png', key:'toolButtons'}, onDown:selectOption }),
            ui.createButton('', {id:0, state:getStateForId(0), x: 55, y:y, img:{frame:'Keyboard.png', key:'toolButtons'}, onDown:selectOption })
        ];
        
        for(var i in radioButtons) group.add( radioButtons[i] );
        
        //--- Button back:
        optionsMenu.group.add(ui.createButton(__('Back'), { onDown:this.hideOptions.bind(this), y:group.height + 100 }));
        
        return optionsMenu;
        
    },
    
    //==========================================================================
    // Credits
    //==========================================================================
    
    createCredits: function() {
        
        //--- Credits menu:
        var creditsMenu = this.creditsMenu = {};

        var data = [
                __('Design, graphics, music,\nanimation and programming by') + ':'
            ,
            {
                img:'mrdigger'
            },
            {
                link:['http://sad-systems.ru/#team', 'Mr Digger'], //'mailto:sad-systems@mail.ru'
                options:{ y: +10 } // style:'name',
            },
            {
                text:'\n' + '© 2016 SAD-Systems',
                options:{ style:'smallText' }
            },
            {
                link:'http://sad-systems.ru'
            },
            {
                text:'\n' + __('Powered by') + ' Phaser 2.4.8',
                options:{ style:'smallText' }
            },
            {
                link:'http://phaser.io'
            },
            {
                button:__('Back'),
                options: { y:20, onDown:this.hideCredits.bind(this) }
            }
            
        ];
        
        creditsMenu.group = ui.createGroup(data, {x:this.game.camera.view.centerX, y:this.game.height} );
        
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
