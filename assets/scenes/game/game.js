var Config = require("Config");
var groupIndexs = require('groupIndexs');
cc.Class({
    extends: cc.Component,

    properties: {
        UIManager: cc.Node,
        operatorContent: cc.Node,
        originData: [],
        nowData: [],
        testData: [],
        _slotArray: [],

        slotPrefab: cc.Prefab,
        playground: cc.Node,

        flag: false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        Config.GP = this;
        this.testStart();
    },
    testStart() {
        let data = [
            0, 0, 5, 3, 0, 0, 0, 0, 0,
            8, 0, 0, 0, 0, 0, 0, 2, 0,
            0, 7, 0, 0, 1, 0, 5, 0, 0,
            4, 0, 0, 0, 0, 5, 3, 0, 0,
            0, 1, 0, 0, 7, 0, 0, 0, 6,
            0, 0, 3, 2, 0, 0, 0, 8, 0,
            0, 6, 0, 5, 0, 0, 0, 0, 9,
            0, 0, 4, 0, 0, 0, 0, 3, 0,
            0, 0, 0, 0, 0, 9, 7, 0, 0,
        ];

        this.gameSceneInit(data);
        this.nowData = this.originData;

        this.testDataInit();
        this.tryArray = [];

    },
    generateGameData() { },
    gameSceneInit(data) {
        this.originData = data;
        let content = this.playground;
        let col = 9;
        let padding = 8;
        let blockSize = 60;
        let indent = (content.width - (2 * padding) - (col * blockSize)) / (col + 5);
        let startPosition = cc.v2(-content.width / 2 + blockSize / 2 + padding, content.height / 2 - padding - blockSize / 2);
        for (let i = 0; i < data.length; i++) {
            let x = i % 9;
            let y = Math.floor(i / 9);
            let item = cc.instantiate(this.slotPrefab);
            item.parent = content;
            item.position = startPosition.add(
                cc.v2(
                    x * (indent + blockSize) + indent * 3 * (Math.floor(x / 3)),
                    -y * (indent + blockSize) - indent * 3 * (Math.floor(y / 3))
                )
            );
            item.index = i;
            let comp = item.getComponent('slot');
            comp.init(data[i]);
            item.on('touchend', comp.clickHandler, comp);
            this._slotArray.push(item);
        }

    },
    setOperatorConetentState(index) {
        let arr = this.testData[index];

        for (let i = 0; i < 9; i++) {
            let item = this.operatorContent.children[i];
            item.getComponent('operator').setEnable(false);
        }

        for (let i = 0; i < arr.length; i++) {
            let cIndex = parseInt(arr[i]) - 1;
            let child = this.operatorContent.children[cIndex];
            child.getComponent('operator').setEnable(true);
        }
    },
    setPlaygroundState(index){
        let n=this.nowData[index];
        for(let i =0;i<this.nowData.length;i++){
            if(this.nowData[i]==n){
                this._slotArray[i].getComponent('slot').setStrong();
            }else{
                this._slotArray[i].getComponent('slot').refresh();

            }
        }
    },
    clickHandler() {
        console.log('item click')
    },
    gameStart() { },
    startLevel(data) {
        for (let i = 0; i < this._slotArray.length; i++) {
            let item = this._slotArray[i];
            let comp = item.getComponent('slot');
            comp.init(data[i]);
        }
     },
    nextLevel() { },

    gameRestart() { },
    gamePause() { },
    gameOver() { },

    checkGame() {
        let success = true;
        //---  is full
        for (let i in groupIndexs) {
            let test = 0;
            for (let index of groupIndexs[i]) {
                test += Math.pow(10, 9 - parseInt(this.nowData[index]));
            }
            if (test != 111111111) {
                console.log(i, test)
                console.log(this.nowData)
                return false;
            }
        }
        //---  is success
        console.log('game over,', true)

        return true;

    },
    decryptSuudoku(data) {
        this.testDataInit();
        this.flag = true;
        this.endState = null;

        this.tryArray = [];
        this.decrypt();
    },
    testDataInit() {
        for (let i = 0; i < this.nowData.length; i++) {
            if (this.nowData[i]) {
                this.testData[i] = 0;
            } else {
                this.testData[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            }
        }
        for (let i = 0; i < this.nowData.length; i++) {
            if (this.nowData[i]) {
                this.shaveTestData(i);
            }
        }
    },
    decrypt() {
        console.log(this.count);
        this.count++;
        //--  某个格子只有一个 猜想值时,填入
        for (let i in this.testData) {
            let item = this.testData[i];

            if (item instanceof Array && item.length == 1) {
                // console.log('slot unique select', i, item)
                this.setTestData(i, item[0]);
                // console.log('--------------------shave1 ,', i)
                this.decrypt();
                return;
            }
        }
        //-- 某组中,存在一个数,只在其中一个格子的猜想值中出现
        for (let item in groupIndexs) {
            let ob = this.getUniqueNumber(groupIndexs[item], item);
            if (ob.index >= 0) {
                // console.log('group unique select,group:', item)
                this.setTestData(ob.index, ob.n)
                // console.log('--------------------shave2 ,', ob.index)
                this.decrypt();
                return;
            }
        }
        //--- 尝试
        this.tryTest();
        let success = this.checkGame();
        // if (!success) this.tryTestRollBack();

        success = this.checkGame();
        // console.log('check game :success:', success)

        this.flag = false;
        console.log(this.tryArray)
        return;
    },
    tryTest() {
        let a;
        console.log('before try ', this.testData)

        for (let i in this.testData) {
            let item = this.testData[i];
            if (item instanceof Array && item.length === 0) {

                console.log('try fail,at:', i, item)
                this.tryTestRollBack();
                return;
            }
        }


        for (let i in this.testData) {
            let item = this.testData[i];

            if (item instanceof Array && item.length == 2) {
                let array = [];
                for (let i = 0; i < this.testData.length; i++) {
                    if (this.testData[i] instanceof Array) {
                        let aa = [];
                        for (let j = 0; j < this.testData[i].length; j++) {
                            aa[j] = this.testData[i][j];
                        }
                        array[i] = aa;
                    } else {
                        array[i] = this.testData[i];
                    }
                }
                this.tryArray.push({
                    index: i,
                    value: item[0],
                    state: array
                })
                this.setTestData(i, item[0]);
                // console.log('trying', this.tryArray)

                // console.log('--------------------tryTest ,', i)
                // console.log(this.tryArray)


                this.decrypt();
                return;
            }


            if (item instanceof Array && item.length > 2) {
                let array = [];
                for (let i = 0; i < this.testData.length; i++) {
                    if (this.testData[i] instanceof Array) {
                        let aa = [];
                        for (let j = 0; j < this.testData[i].length; j++) {
                            aa[j] = this.testData[i][j];
                        }
                        array[i] = aa;
                    } else {
                        array[i] = this.testData[i];
                    }
                }
                this.tryArray.push({
                    index: i,
                    value: item[0],
                    state: array
                })
                this.setTestData(i, item[0]);
                // console.log('trying', this.tryArray)

                // console.log('--------------------tryTest ,', i)
                // console.log(this.tryArray)


                this.decrypt();
                return;
            }
        }


    },
    tryTestRollBack() {
        console.log('tryTestRollBack', this.tryArray);

        if (this.tryArray.length <= 0) return;
        let obj = this.tryArray.pop();
        this.testData = obj.state;
        // console.log('--------------------tryTestRollBack ,', obj.index)
        this.testData[obj.index].splice(this.testData[obj.index].indexOf(obj.value), 1);
        if (this.testData[obj.index].length == 0) {
            this.tryTestRollBack();
            return;
        }
        this.decrypt();

    },
    getUniqueNumber(group, name) {
        let obj = {
            n: 0,
            index: -1,
        };
        let test = 1111111111;
        for (let item in group) {
            if (this.testData[group[item]] instanceof Array && this.testData[group[item]].length > 0) {
                for (let i of this.testData[group[item]]) {
                    test += Math.pow(10, 9 - i);
                }
            }
        }
        test = test + '';
        let n = test.indexOf('2');
        obj.n = n;
        if (n >= 0) {
            for (let item in group) {
                if (this.testData[group[item]] instanceof Array && this.testData[group[item]].length > 0) {
                    if (this.testData[group[item]].indexOf(n) >= 0) {
                        obj.index = group[item];
                    }
                }
                if (name == 'r2') console.log(this.testData[group[item]])
            }
        }


        return obj;
    },
    deleteTestData(index) {
        // console.log('#set test data,index：', index, n)
        this.nowData[index] = 0;
        this._slotArray[index].getComponent('slot').delete();
        this.testDataInit();
        this.shaveTestData(index);
        // console.log(this.testData);
    },
    setTestData(index, n) {
        // console.log('#set test data,index：', index, n)
        this.testData[index] = n;
        this.nowData[index] = n;
        this._slotArray[index].getComponent('slot').insert(n);
        this.shaveTestData(index);
        // console.log(this.testData);
    },
    shaveTestData(index) {
        for (let rcb in groupIndexs) {
            //---  若某个小组包含 index,则这些小组排除 下标为i的值
            let indexOfGroup = groupIndexs[rcb].indexOf(parseInt(index));
            if (indexOfGroup >= 0) {

                for (let detailIndex of groupIndexs[rcb]) {
                    if (this.testData[detailIndex] instanceof Array) {
                        //--该group中 去掉无效猜想值
                        // console.log(this.testData[detailIndex])
                        let testIndex = this.testData[detailIndex].indexOf(this.nowData[index]);
                        if (testIndex >= 0) {
                            this.testData[detailIndex].splice(testIndex, 1);
                        }
                        // console.log(this.testData[detailIndex])

                    }
                }
            }
        }

    },
    showArray() {
        for (let i of this._slotArray) {
            i.getComponent('slot').show(0);
        }
        for (let i of this.tryArray) {
            let index = parseInt(i.index);
            this._slotArray[index].getComponent('slot').show(i.value);
        }
    },

    // update (dt) {},
});
