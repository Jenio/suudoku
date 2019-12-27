var Config=require('Config');
cc.Class({
    extends: cc.Component,

    properties: {
     gameScene:cc.Node,
     menuScene:cc.Node,
     gameOverPanelPrefab:cc.Prefab,
     gamePausePanelPrefab:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    showMenuScene(){
        this.closeAllScene();
        this.menuScene.active=true;
    },
    showGameScene(){
        this.closeAllScene();
        this.gameScene.active=true;
    },
    showGameOverPanel(){
        let gameover=cc.instantiate(this.gameOverPanelPrefab);
        gameover.parent=this.node;
        gameover.getChildByName('close').on('touchend',function(){
            gameover.destroy();
        },this)
    },
    showGamePausePanel(){
        let gamePause=cc.instantiate(this.gamePausePanelPrefab);
        gamePause.parent=this.node;
        gamePause.getChildByName('close').on('touchend',function(){
            gamePause.destroy();
        },this)
    },
    closeAllScene(){
        this.gameScene.active=false;
        this.menuScene.active=false;
    },
    // update (dt) {},
});
