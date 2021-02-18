let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');
var user_info;
var curTag = 'mistaken';
Page({
    data: {
        wordList: [],
        isCurrent: ['hovering', '', ''],
        showDelete: true
    },
    onLoad: function (options) {
        wx.showLoading({
            title: 'Loading',
            duration: 300
        });
        var that = this;
        wechat.getStorage('user_info').then(res => {
            user_info = res.data;
            that.setData({
                wordList: user_info.word_tag.mistaken
            });
        }, err => { });
    },
    onShow: function () {
        this.onLoad();
        this.setData({
            isCurrent: ['hovering', '', ''],
            showDelete: true
        })
    },
    showCompleted: function () {
        curTag = 'completed';
        this.setData({
            wordList: user_info.word_tag.completed,
            isCurrent: ['', '', 'hovering'],
            showDelete: true,
            showDelete: false
        });
    },
    showMistaken: function () {
        curTag = 'mistaken';
        this.setData({
            wordList: user_info.word_tag.mistaken,
            isCurrent: ['hovering', '', ''],
            showDelete: true
        });
    },
    showCollected: function () {
        curTag = 'collected';
        this.setData({
            wordList: user_info.word_tag.collected,
            isCurrent: ['', 'hovering', ''],
            showDelete: true
        });
    },
    showDetails: function (e) {
        var index = e.currentTarget.dataset.index;
        var words = user_info.word_tag[curTag];
        // console.log(index, words);
        wechat.setStorage("currentWord", words[index]).then(res => {
            wx.navigateTo({
                url: '../wordDetails/wordDetails'
            });
        }, err => { });

    },
    setCompleted: function (e) {
        var index = e.currentTarget.dataset.index;
        var words = user_info.word_tag[curTag];
        var completed = user_info.word_tag.completed;
        var tmp = [];
        // console.log(completed);
        for (var i = 0; i < completed.length; i++) {
            tmp.add(completed[i].en);
        }
        console.log(words, index);
        if (!tmp.includes((words[index]).en)) {
            user_info.word_tag.completed.add(words[index]);
        }
        words.remove(index);
        user_info.word_tag[curTag] = words;
        this.setData({
            wordList: words
        })
        wechat.setStorage('user_info', user_info);
        updateCloud();
    }
});

function updateCloud() {
    user_info.update_time = time.getTime();
    wechat.callFunction("updateUser", {
        _openid: user_info._openid,
        data: {
            data: user_info.data,
            update_time: user_info.update_time,
            word_tag: user_info.word_tag,
            unpassed: user_info.unpassed
        }
    });
}