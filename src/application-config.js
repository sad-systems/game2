/*==============================================================================
 *  Title      : Application Config
 *  Author     : Digger (c) SAD-Systems <http://sad-systems.ru>
 *  Created on : 27.04.2015
 *==============================================================================
 */
// 4:3 = 640×480 | 800x600 | 960x720 | 1024×768 | 2048×1536 | 3200×2400 | 6400×4800
module.exports = {
    game: {
        width:  640,//600/800/960
        height: 480,//450/600/720
        renderer: Phaser.AUTO,
        parent: '',
        transparent: false,
        antialias: false,
        //state: this,
        scaleMode: Phaser.ScaleManager.SHOW_ALL
    },
    mainSceneName: "scLogo" //scMainMenu scLogo scene1
};


