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
            var word_list = res.data;
            if (word_list.length < 4) {//缓存中单词数量不足
                return wechat.callFunction("pull").then(res => {//云调用数据库更新
                    word_list = res.data[User.level - 1];
                    return wechat.setStorage("word_list", word_list);//同时写入缓存
                }, err = {});
            }
        }, err => { }).then(empty => {
            list = word_list;//同步至全局
        })
    }
    //更新全局中的页面数据
    this.resetPage = function (this_pointer) {

        //更新单词
        var temp = {};
        for (var i = 0; i < 30; i++) {
            //获取随机数下标,保证随机数范围在[0, list.length)内
            var random_index = Math.floor(Math.random() * list.length);
            //console.log(random);
            temp = list[random_index];
            //优先挑选10分钟内未遇到过的,且已经错过一次以上的单词
            if (temp.last_view_time >= 10 * 60 && temp.power >= 3) {
                break;
            }
        }
        wordIndex = random_index;
        page.problem = temp;

        //更新选项
        var temp = [];
        var right = list[word_index];
        if (list.length < 3) {
            Update();
        }
        //已选中
        var got = [];
        //随机挑选选项
        for (var i = 0; i < 3;) {
            var random_index = Math.floor(Math.random() * list.length);
            if (random_index != word_index && allDifferent(random_index, got)) {//不冲突
                //temp[i++]=list[randomIndex];
                temp[i] = (list[random_index]);
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
            true_option = 0;
        } else if (random >= 0.25 && random < 0.5) {
            temp.insert(1, right);
            true_option = 1;
        } else if (random >= 0.5 && random < 0.75) {
            temp.insert(2, right);
            true_option = 2;
        } else {
            temp.insert(3, right);
            true_option = 3;
        }
        //console.log(temp);
        page.options = temp;
        //同步页面
        this_pointer.setData({
            problem: problem,
            options: options,
            hover_class: hover_class,
            selected: selected,
            correct: correct
        });
    }

}


let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');
let DB = wx.cloud.database();
let word = new Word;
//let user = new User;


Page({
    data: {
        problem: {},
        options: [],
        hover_class: ['', '', '', ''],
        selected: false,
        correct: false
    },
    onLoad: function () {
        word.asyncInit();//单词初始化
        word.resetPage(this);//信息同步至页面
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

//console.log(sha);


wx.cloud.callFunction({
    name: "getOpenId",
    success: function (res) {
        console.log("openid: ", res.result.openId);
        var sec = sha.SHA1(res.result.openId);
        console.log("openid sha1加密结果: ", sec);
    }
})

let User = require('../../utils/User');

console.log(User);
