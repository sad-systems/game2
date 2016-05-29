/*==============================================================================
 *  Title      : Boot scene
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru>
 *  Created on : 27.04.2016, 17:24:18
 *==============================================================================
 */

var nextScene = 'scene1'; //'scTitle';

//------------------------------------------------------------------------------
// Scene
//------------------------------------------------------------------------------

var scene = function () {}; //new Phaser.State();
    scene.prototype = {
        
        //----------------------------------------------------------------------
        preload: function() {
            // Static images:
            this.game.load.image('logoBg',  'assets/bg/intro/bg.jpg');
            this.game.load.image('logoImg', 'assets/bg/intro/sad-systems.png');
            //--- Test:
            //this.game.load.image('big11',  'assets/sprites/big1.jpg');
            //this.game.load.image('big21',  'assets/sprites/big2.jpg');
            //this.game.load.image('big31',  'assets/sprites/big3.jpg');
            //this.game.load.image('big41',  'assets/sprites/big4.jpg');            
        },
        
        //----------------------------------------------------------------------
        create: function() {
            
            var game = this.game;
            game.extentions.sceneManager.begin();
            
            var bg   = game.add.image(0, 0, 'logoBg'),
                logo = game.add.sprite(game.camera.view.centerX, game.camera.view.centerY, 'logoImg');
                logo.anchor.set(0.5);
                logo.fixedToCamera = true;
                logo.alpha = 0;

            game.world.setBounds(0, 0, 960, 640);
            
            var tw = game.add.tween(logo);
                tw.to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 2000, 0, false);
           
            var t2 = game.add.tween(game.camera);
                t2.onComplete.add(function(){  
                    game.extentions.sceneManager.next(nextScene);
                });
                t2.to( { x: 100 }, 5000, Phaser.Easing.Linear.None, true, 0, 0, false);

            game.input.onDown.add(game.extentions.sceneManager.gotoFullScreen, this);
            
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
