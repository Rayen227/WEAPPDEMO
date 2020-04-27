let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');
let user = require('../../utils/User.js');

var word_list = [];
var true_option = 0;
var my_option = 0;
var page = {
    problem: {},
    options: []
};



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
        wechat.getStorage("word_list").then(res => {
            word_list = res.data;
            // console.log(word_list);
            if (word_list.length < 4) {//缓存中单词数量不足
                return wechat.callFunction("pull", { key: "word_list" }).then(res => {//云调用数据库更新
                    //console.log(res.result.data);
                    word_list = res.result.data;//DEBUG ONLY
                    return wechat.setStorage("word_list", word_list);//同时写入缓存
                }, err => { console.log("!callFunction:pull, ERROR: ", err) });
            }
            // console.log(word_list);
        }, err => { console.log("!getStorage:word_list, ERROR: ", err) }).then(empty => {
            resetPage(that);
        })
    },
    selectHandle: function (event) {
        my_option = event.currentTarget.dataset.id;
        // console.log("selectHandle");
        var tmp = ['', '', '', ''];
        if (my_option == true_option) {
            //选对啦
            console.log(true);
            tmp[my_option] = 'answer-hover-true';
            this.setData({
                correct: true,
                selected: true,
                hover_class: tmp
            });
        } else {
            // ... 
            console.log(false);
            tmp[my_option] = 'answer-hover-false';
            this.setData({
                correct: false,
                selected: true,
                hover_class: tmp
            });
        }
    },
    showDetailsHandle: function (event) {
        // console.log("showDetailesHandle");
        let that = this;
        wx.setStorage({
            key: "gamePage",
            data: {
                problem: page.problem,
                options: page.options
            },
            success: function () {
                wx.navigateTo({
                    url: 'wordDetails/wordDetails?item=' + event.currentTarget.dataset.id
                });
            }
        })

    },
    resetHandle: function () {
        resetPage(this);
    }
});

// let sha = require('../../utils/HASH_SHA1');





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


// 测试代码
/* wx.setStorage({
    key: "user_info",
    data: {
        basic: { nickname: "2 0 1 2", avaterUrl: "#", openId: "155a72dc45b86fc324b9649a89b59d717164fc7f" },
        data: { level: "0", exp: "12", items: [0, 0, 0, 0, 1] },
        update_time: {}
    }
})

wx.setStorage({
    key: "word_list",
    data: [
        { "_id": "cloud-word-apple", "power": 1.0, "last_view_time": 3600.0, "en": "apple", "ch": "n.苹果;", "audio": "audioSrc", "image": "imageSrc" },
        { "_id": "cloud-word-banana", "power": 2.0, "last_view_time": 3600.0, "en": "banana", "ch": "n.香蕉;", "audio": "audioSrc", "image": "imageSrc" },
        { "_id": "cloud-word-carambola", "power": 2.0, "last_view_time": 3600.0, "en": "carambola", "ch": "n.杨桃;", "audio": "audioSrc", "image": "imageSrc" },
        { "_id": "cloud-word-durian", "power": 2.0, "last_view_time": 3600.0, "en": "durian", "ch": "n.榴莲;", "audio": "audioSrc", "image": "imageSrc" },
        { "_id": "cloud-word-grape", "power": 2.0, "last_view_time": 3600.0, "en": "grape", "ch": "n.葡萄;", "audio": "audioSrc", "image": "imageSrc" },
        { "_id": "cloud-word-mango", "power": 2.0, "last_view_time": 3600.0, "en": "mango", "ch": "n.芒果;", "audio": "audioSrc", "image": "imageSrc" },
        { "_id": "cloud-word-mangosteen", "power": 2.0, "last_view_time": 3600.0, "en": "mangosteen", "ch": "n.山竹;", "audio": "audioSrc", "image": "imageSrc" },
        { "_id": "cloud-word-orange", "power": 2.0, "last_view_time": 3600.0, "en": "orange", "ch": "n.橙子;", "audio": "audioSrc", "image": "imageSrc" },
        { "_id": "cloud-word-pear", "power": 2.0, "last_view_time": 3600.0, "en": "pear", "ch": "n.梨;", "audio": "audioSrc", "image": "imageSrc" },
        { "_id": "cloud-word-pineapple", "power": 2.0, "last_view_time": 3600.0, "en": "pineapple", "ch": "n.菠萝;", "audio": "audioSrc", "image": "imageSrc" },
        { "_id": "cloud-word-pitaya", "power": 2.0, "last_view_time": 3600.0, "en": "pitaya", "ch": "n.火龙果;", "audio": "audioSrc", "image": "imageSrc" },
        { "_id": "cloud-word-strawberry", "power": 2.0, "last_view_time": 3600.0, "en": "strawberry", "ch": "n.草莓;", "audio": "audioSrc", "image": "imageSrc" },
        { "_id": "cloud-word-watermelon", "power": 2.0, "last_view_time": 3600.0, "en": "watermelon", "ch": "n.西瓜;", "audio": "audioSrc", "image": "imageSrc" }
    ]
}) */


function allDifferent(item, array) {
    for (let i = 0; i < array.length; i++) {
        if (item == array[i])
            return false;
    }
    return true;
}

// function asyncInit() {
//     wechat.getStorage("word_list").then(res => {
//         var word_list = res.data;
//         // console.log(word_list);
//         if (word_list.length < 4) {//缓存中单词数量不足
//             return wechat.callFunction("pull", { key: "word_list" }).then(res => {//云调用数据库更新
//                 //console.log(res.result.data);
//                 word_list = res.result.data;//DEBUG ONLY
//                 return wechat.setStorage("word_list", word_list);//同时写入缓存
//             }, err => { console.log("!callFunction:pull, ERROR: ", err) });
//         }
//     }, err => { console.log("!getStorage:word_list, ERROR: ", err) }).then(empty => {
//         word_list = word_list;//同步至全局对象word
//         console.log(this);
//     });
// }

function resetPage(this_pointer) {
    var temp = {};
    for (let i = 0; i < 30; i++) {

        //获取随机数下标,保证随机数范围在[0, word_list.length)内
        var random_index = Math.floor(Math.random() * word_list.length);
        //console.log(random);
        temp = word_list[random_index];
        //优先挑选10分钟内未遇到过的,且已经错过一次以上的单词
        if (temp.last_view_time >= 10 * 60 && temp.power >= 3) {
            break;
        }
    }
    let word_index = random_index;
    page.problem = temp;//全局同步

    //更新选项
    temp = [];
    let right = word_list[word_index];
    if (word_list.length < 4) {
        Update();
    }
    //已选中
    let got = [];
    //随机挑选选项
    for (let i = 0; i < 3;) {
        random_index = Math.floor(Math.random() * word_list.length);
        if (random_index != word_index && allDifferent(random_index, got)) {//不冲突
            //temp[i++]=word_list[randomIndex];
            temp[i] = (word_list[random_index]);
            got[i] = random_index;
            //console.log(last);
            i++;
            //console.log(randomIndex);
        }
    }
    //随机插入正确答案
    let random = Math.random();

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
    page.options = temp;//全局同步
    //页面同步
    this_pointer.setData({
        problem: page.problem,
        options: page.options,
        selected: false,//刷新状态
        correct: false,
        hover_class: ['', '', '', '']
    });


}