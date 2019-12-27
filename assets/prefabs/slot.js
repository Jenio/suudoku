var Config = require('Config');
cc.Class({
    extends: cc.Component,

    properties: {
        isOrigin: false,
        data: 1,
        label: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    init(n) {
        if (n) {
            this.isOrigin = true;
            this.data = n;
        } else {
            this.isOrigin = false;
            this.data = null;
        }
        this.refresh();

    },
    clickHandler() {
        Config.selectedSlot=this;

        Config.GP.setOperatorConetentState(this.node.index);
        Config.GP.setPlaygroundState(this.node.index);
        this.node.color=new cc.Color().fromHEX('#7CFFE9')
        this.node.runAction(
                cc.tintTo(2,126,189,255)
        )
        console.log(Config.selectedSlot)
    },
    refresh() {
        if (this.data) {
            this.label.string = this.data;
        } else (
            this.label.string = ''
        )

        if(this.isOrigin){
            this.label.node.color=cc.Color.BLACK;
        }else{
            this.label.node.color=cc.Color.GRAY;
        };
    },
    setStrong(){
        this.label.node.color=cc.Color.RED;
    },
    insert(n) {
        if (this.isOrigin) return;
        this.data = n;
        this.refresh();
    },

    delete() {
        if (this.isOrigin) return;
        this.data = null;
        this.refresh();
    },

    //---  debug
    show(n) {
        this.data = n;
        this.refresh();
    },
   
    // update (dt) {},
});
