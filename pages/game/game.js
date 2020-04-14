let User = function () {
    //private:
    function levelUp() {
        this.data.level++;
    }
    function expUp() {
        this.data.exp += 3;
    }
    function update(user) {
        this.details = user.details;
        this.update_time = time.getTime();
    }
    function cmp(golbal, local, cloud) {
        if (time.compare(golbal.update_time, local.update_time)) {
            return time.compare(golbal.update_time, cloud.update_time) ? golbal : cloud;
        }
        else {
            return time.compare(local.update_time, cloud.update_time) ? local : cloud;
        }
    }
    //public:
    this.basic = {};//系统获取的用户信息
    this.data = {};
    this.update_time = {};
    this.items = [];

    //以系统获取的用户信息为参数
    this.init = function (basic) {
        this.basic = basic;
        this.details = user_info;
        this.update_time = time.getTime();
    }

    //根据答对的单词获取一定的经验值
    this.getPoint = function (word) {

    }
    // this.asynSetStorage = function(){
    //     wx.setStorage({
    //         key: "user_info",
    //         data: this
    //     });
    // }
    this.asynUpdate = function () {
        var local, cloud;
        wechat.getStorage("user_info").then(res => {
            local = res.data;
            return wechat.callFunction("getUser");
        }, err => { }).then(res => {
            console.log(res);
            //cloud = res;
        }, err = {}).then(jdg => {
            var tmp = cmp(this, local, cloud);
            tmp.update_time = time.getTime();
            return wechat.setStorage("user_info", tmp);
        }).then(res => {
            console.log(tmp, "缓存更新");
            return wechat.callFunction("setUser", tmp);
        }, err => { }).then(res => {
            console.log(res, "云更新");
        }, err => { console.log(err, "云更新失败") }).then(empty => {
            this.update(tmp);//全局更新
        })
    }

}

let Word = function () {
    //private:
    function allDifferent(item, array) {
        for (var i = 0; i < array.length; i++) {
            if (item == array[i])
                return false;
        }
        return true;
    }
    //public:
    //全局单词表
    this.list = [];
    //正确选项 0~3
    this.trueOption = 0;
    //页面相关的数据
    this.page = {
        problem: {},
        options: [],
        trueOption: 0,
        hoverClass: ['', '', '', ''],
        selected: false,
        correct: undefined
    };
    //更新全局中的页面数据
    this.reset = function () {

        //更新单词
        var temp = {};
        for (var i = 0; i < 30; i++) {
            //获取随机数下标,保证随机数范围在[0, list.length)内
            var randomIndex = Math.floor(Math.random() * list.length);
            //console.log(random);
            temp = list[randomIndex];
            //优先挑选10分钟内未遇到过的,且已经错过一次以上的单词
            if (temp.lastViewTime >= 10 * 60 && temp.power >= 3) {
                break;
            }
        }
        wordIndex = randomIndex;
        page.problem = temp;

        //更新选项
        var temp = [];
        var right = list[wordIndex];
        if (list.length < 3) {
            checkAndUpdate();
        }
        //已选中
        var got = [];
        //随机挑选选项
        for (var i = 0; i < optionAmount - 1;) {
            var randomIndex = Math.floor(Math.random() * list.length);
            if (randomIndex != wordIndex && allDifferent(randomIndex, got)) {//不冲突
                //temp[i++]=list[randomIndex];
                temp[i] = (list[randomIndex]);
                got[i] = randomIndex;
                //console.log(last);
                i++;
                //console.log(randomIndex);
            }
        }
        //随机插入正确答案
        var random = Math.random();

        if (random >= 0 && random < 0.25) {
            temp.insert(0, right);
            trueOption = 0;
        } else if (random >= 0.25 && random < 0.5) {
            temp.insert(1, right);
            trueOption = 1;
        } else if (random >= 0.5 && random < 0.75) {
            temp.insert(2, right);
            trueOption = 2;
        } else {
            temp.insert(3, right);
            trueOption = 3;
        }
        //console.log(temp);
        page.options = temp;
    }

}


let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');
let DB = wx.cloud.database();
let word = new Word;
let user = new User;

Page({
    data: {
        problem: {},
        options: []
    },
    onLoad: function () {

    }
});




