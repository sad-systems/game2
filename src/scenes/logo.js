/*==============================================================================
 *  Title      : Boot scene
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru>
 *  Created on : 27.04.2016
 *==============================================================================
 */

var nextScene = 'scMainMenu',
    controls  = require('mainControls');

//------------------------------------------------------------------------------
// Scene
//------------------------------------------------------------------------------

var scene = function () {}; //new Phaser.State();
    scene.prototype = {
        
        //----------------------------------------------------------------------
        preload: function() {
            //--- Static images:
            this.game.load.image('logoBg',  'assets/bg/intro/bg.jpg');
            this.game.load.image('logoImg', 'assets/bg/intro/sad-systems.png');
            //--- Coomon controls:
            controls.preload(this.game);
        },
        
        //----------------------------------------------------------------------
        create: function() {
            
            var game = this.game;
            game.extentions.sceneManager.begin();
            
            //--- Images:
            
            var bg   = game.add.image(0, 0, 'logoBg'),
                logo = game.add.sprite(game.camera.view.centerX, game.camera.view.centerY, 'logoImg');
                logo.anchor.set(0.5);
                logo.fixedToCamera = true;
                logo.alpha = 0;

            game.world.setBounds(0, 0, 1280, 480);
            
            //--- Animations:
            
            var t1 = game.add.tween(logo);
                //t1.onComplete.add(function(){});
                t1.to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 2000, 0, false);
           
            var t2 = game.add.tween(game.camera);
                t2.onComplete.add(function(){  
                    game.extentions.sceneManager.next(nextScene);
                });
                t2.to( { x: 320 }, 8000, Phaser.Easing.Linear.None, true, 0, 0, false);
      
            //--- Common controls:
            controls.create(this.game);
            controls.onResize = function() { logo.cameraOffset.set(game.camera.width/2, game.camera.height/2); };
            
        },
        
        //----------------------------------------------------------------------
        update: function() {
            //var game = this.game;
            //Camera position:
            //game.camera.x += 1;
            //game.camera.y += 0.1;
        }
        
        //render: function() {}        
    };

//------------------------------------------------------------------------------
// Exports module values:
//------------------------------------------------------------------------------

module.exports = scene;
