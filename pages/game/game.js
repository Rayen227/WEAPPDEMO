let Word = function () {
    //private:
    var word_list;
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
    this.true_option = 0;
    //玩家的选则
    this.my_option = 0;
    //页面相关的数据
    this.page = {
        problem: {},
        options: [],
        click: 0,//用于在showDetails页面获取需要展示的单词
        hover_class: ['', '', '', ''],
        selected: false,
        correct: false
    };
    //初始化函数//以缓存中的Word对象(word)为参数
    this.asyncInit = function () {
        wechat.getStorage("word_list").then(res => {
            word_list = res.data;
            if (word_list.length < 4) {//缓存中单词数量不足
                return wechat.callFunction("pull", { key: "word_list" }).then(res => {//云调用数据库更新
                    //console.log(res.result.data);
                    word_list = res.result.data;//DEBUG ONLY
                    return wechat.setStorage("word_list", word_list);//同时写入缓存
                }, err => { console.log("!callFunction:pull, ERROR: ", err) });
            }
        }, err => { console.log("!getStorage:word_list, ERROR: ", err) }).then(empty => {
            this.list = word_list;//同步至全局对象word
            //console.log(this.list);
        })
    }
    //更新全局中的页面数据
    this.resetPage = function (this_pointer) {
        //console.log(this);
        //更新单词
        console.log(this);
        console.log(this.list)
        var temp = {};
        for (var i = 0; i < 30; i++) {

            //获取随机数下标,保证随机数范围在[0, list.length)内
            var random_index = Math.floor(Math.random() * this.list.length);
            //console.log(random);
            temp = this.list[random_index];
            //优先挑选10分钟内未遇到过的,且已经错过一次以上的单词
            if (temp.last_view_time >= 10 * 60 && temp.power >= 3) {
                break;
            }
        }
        wordIndex = random_index;
        this.page.problem = temp;

        //更新选项
        var temp = [];
        var right = this.list[word_index];
        if (this.list.length < 4) {
            Update();
        }
        //已选中
        var got = [];
        //随机挑选选项
        for (var i = 0; i < 3;) {
            var random_index = Math.floor(Math.random() * this.list.length);
            if (random_index != word_index && allDifferent(random_index, got)) {//不冲突
                //temp[i++]=list[randomIndex];
                temp[i] = (this.list[random_index]);
                got[i] = random_index;
                //console.log(last);
                i++;
                //console.log(randomIndex);
            }
        }
        //随机插入正确答案
        var random = Math.random();

        if (random >= 0 && random < 0.25) {
            temp.insert(0, right);
            this.true_option = 0;
        } else if (random >= 0.25 && random < 0.5) {
            temp.insert(1, right);
            this.true_option = 1;
        } else if (random >= 0.5 && random < 0.75) {
            temp.insert(2, right);
            this.true_option = 2;
        } else {
            temp.insert(3, right);
            this.true_option = 3;
        }
        //console.log(temp);
        this.page.options = temp;
        //同步页面
        this_pointer.setData({
            problem: this.page.problem,
            options: this.page.options,
            hover_class: this.page.hover_class,
            selected: this.page.selected,
            correct: this.page.correct
        });
    }

}


let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');
let DB = wx.cloud.database();
let word = new Word;
let user = require('../../utils/User.js');


Page({
    data: {
        problem: {},
        options: [],
        hover_class: ['', '', '', ''],
        selected: false,
        correct: false
    },
    onLoad: function () {
        var that = this;
        wechat.setStorage("test", 1).then(res => {
            word.asyncInit();
        }, err => { }).then(empty => {
            word.resetPage(that);
        })
    },
    selectHandle: function (event) {
        word.my_option = event.currentTarget.dataset.id;
        if (word.my_option == word.true_option) {
            //选对啦
        } else {
            // ... 
        }
    },
    showDetailsHandle: function () {
        wx.navigateTo({
            url: 'wordDetails/wordDetails'
        })
    }
});

let sha = require('../../utils/HASH_SHA1');


//演示代码
//console.log(sha);


// wx.cloud.callFunction({
//     name: "getOpenId",
//     success: function (res) {
//         console.log("openid: ", res.result.openId);
//         var sec = sha.SHA1(res.result.openId);
//         console.log("openid sha1加密结果: ", sec);
//     }
// })

// let User = require('../../utils/User');

// console.log(User);


//测试代码
// wx.setStorage({
//     key: "user_info",
//     data: {
//         basic: { nickname: "2 0 1 2", avaterUrl: "#", openId: "155a72dc45b86fc324b9649a89b59d717164fc7f" },
//         data: { level: "0", exp: "12", items: [0, 0, 0, 0, 1] },
//         update_time: {}
//     }
// })

// wx.setStorage({
//     key: "word_list",
//     data: [
//         { "_id": "cloud-word-apple", "power": 1.0, "last_view_time": 3600.0, "en": "apple", "ch": "n.苹果;", "audio": "audioSrc", "image": "imageSrc" },
//         { "_id": "cloud-word-banana", "power": 2.0, "last_view_time": 3600.0, "en": "banana", "ch": "n.香蕉;", "audio": "audioSrc", "image": "imageSrc" },
//         { "_id": "cloud-word-carambola", "power": 2.0, "last_view_time": 3600.0, "en": "carambola", "ch": "n.杨桃;", "audio": "audioSrc", "image": "imageSrc" },
//         { "_id": "cloud-word-durian", "power": 2.0, "last_view_time": 3600.0, "en": "durian", "ch": "n.榴莲;", "audio": "audioSrc", "image": "imageSrc" },
//         { "_id": "cloud-word-grape", "power": 2.0, "last_view_time": 3600.0, "en": "grape", "ch": "n.葡萄;", "audio": "audioSrc", "image": "imageSrc" },
//         { "_id": "cloud-word-mango", "power": 2.0, "last_view_time": 3600.0, "en": "mango", "ch": "n.芒果;", "audio": "audioSrc", "image": "imageSrc" },
//         { "_id": "cloud-word-mangosteen", "power": 2.0, "last_view_time": 3600.0, "en": "mangosteen", "ch": "n.山竹;", "audio": "audioSrc", "image": "imageSrc" },
//         { "_id": "cloud-word-orange", "power": 2.0, "last_view_time": 3600.0, "en": "orange", "ch": "n.橙子;", "audio": "audioSrc", "image": "imageSrc" },
//         { "_id": "cloud-word-pear", "power": 2.0, "last_view_time": 3600.0, "en": "pear", "ch": "n.梨;", "audio": "audioSrc", "image": "imageSrc" },
//         { "_id": "cloud-word-pineapple", "power": 2.0, "last_view_time": 3600.0, "en": "pineapple", "ch": "n.菠萝;", "audio": "audioSrc", "image": "imageSrc" },
//         { "_id": "cloud-word-pitaya", "power": 2.0, "last_view_time": 3600.0, "en": "pitaya", "ch": "n.火龙果;", "audio": "audioSrc", "image": "imageSrc" },
//         { "_id": "cloud-word-strawberry", "power": 2.0, "lastlast_view_timeTime": 3600.0, "en": "strawberry", "ch": "n.草莓;", "audio": "audioSrc", "image": "imageSrc" },
//         { "_id": "cloud-word-watermelon", "power": 2.0, "last_view_time": 3600.0, "en": "watermelon", "ch": "n.西瓜;", "audio": "audioSrc", "image": "imageSrc" }
//     ]
// })
