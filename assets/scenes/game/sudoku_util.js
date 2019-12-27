var groupIndexs = require('groupIndexs');

let util={
    originData: [],
    nowData: [],
    testData: [],
    tryArray: [],
    count: 0,
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
        this.tryArray = [];
        this.decrypt();
    },
    testDataInit() {
        this.nowData = this.originData;
        for (let i = 0; i < this.nowData.length; i++) {
            if (this.nowData[i]) {
                this.testData.push(0);
            } else {
                this.testData.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
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
};

module.exports=util;