var Config = require('Config');
cc.Class({
    extends: cc.Component,

    properties: {
        data: 1,
    },

    start() {

    },
    setEnable(boolean) {
        this.node.getComponent(cc.Button).interactable = boolean;
    },
    operatorClick(event, data) {
        if (!Config.selectedSlot) return;
        if (data === 'a') { Config.GP.deleteTestData(Config.selectedSlot.node.index); return; }
        let n = parseInt(data);
        // Config.selectedSlot.insert(n);
        Config.GP.setTestData(Config.selectedSlot.node.index,n);

    },

    // update (dt) {},
});
