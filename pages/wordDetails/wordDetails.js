let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');
var user_info;
var words = [];
var emptyStar = 'https://656c-elay-t6atq-1302369471.tcb.qcloud.la/program/worddetails/uncheck.png?sign=1a1007b614e4bf1dee63abc28508bcba&t=1613747581';
var fullStar = 'https://656c-elay-t6atq-1302369471.tcb.qcloud.la/program/worddetails/check.png?sign=d40ff65c883775d60b70a1c2411785dc&t=1613747599';
var bloderweight = 'bolder';

Page({
    data: {
        word: {},
        isStar: false,
        starUrl: '',
        fontweight: '',
    },

    onLoad: function () {
        let that = this;
        var word = {};
        var isStar;
        // wx.showLoading({
        //     title: 'Loading',
        //     duration: 500
        // });
        wechat.getStorage("currentWord").then(res => {
            word = res.data;
            word.mp3 = "http://tts.youdao.com/fanyivoice?word=" + word.en + "&le=eng&keyfrom=speaker-target";
            word.aac = "http://tts.youdao.com/fanyivoice?word=" + word.sentenceEn + "&le=eng&keyfrom=speaker-target";
            // console.log(word.aac);
            that.setData({ word: word });
            return wechat.getStorage("user_info");
        }, err => { }).then(res => {
            user_info = res.data;
            var tmp = user_info.word_tag.collected;
            words = [];
            for (var i = 0; i < tmp.length; i++) {
                words.add(tmp[i].en);
            }
            isStar = words.includes(word.en) ? true : false;
            that.setData({
                isStar: isStar,
                starUrl: isStar ? fullStar : emptyStar
            });
        });
    },
    playMp3: function () {
        var audio = wx.createInnerAudioContext();
        var word = this.data.word;
        var fontweight;
        audio.src = word.mp3;
        audio.onError(err => {
            console.log(err);
        });

        audio.play();

        this.setData({
            fontweightda: bloderweight
        })
        var that = this;
        setTimeout(function () {
            that.setData({
                fontweight: ''
            })
        }, 3000);
    },
    playAac: function () {
        var audio = wx.createInnerAudioContext();
        var word = this.data.word;
        audio.src = word.aac;
        audio.onError(err => {
            console.log(err);
        });
        audio.play();
    },
    starWord: function () {
        var that = this;
        if (!this.data.isStar) {//未收藏
            wx.showToast({
                title: "已收藏",
                icon: "success",
                duration: 1800
            });
            var tmp_word = {};
            tmp_word.en = this.data.word.en;
            tmp_word.ch = this.data.word.ch;
            tmp_word.last_view_time = this.data.word.last_view_time;
            tmp_word.accent = this.data.word.accent;
            tmp_word.power = this.data.word.power;
            tmp_word.sentenceEn = this.data.word.sentenceEn;
            tmp_word.sentenceCh = this.data.word.sentenceCh;
            user_info.word_tag.collected.add(tmp_word);
            that.setData({
                isStar: true,
                starUrl: fullStar
            });
            words.add(tmp_word.en);
        } else {//已收藏
            that.setData({
                isStar: false,
                starUrl: emptyStar
            });
            wx.showToast({
                title: "已取消",
                icon: "success",
                duration: 800
            });
            for (var i = 0; i < words.length; i++) {
                if (that.data.word.en == words[i]) {
                    user_info.word_tag.collected.remove(i);
                    words.remove(i);
                    break;
                }
            }
        }
        wechat.setStorage("user_info", user_info);
        updateCloud();
    },
    onUnload: function () {
        wx.removeStorage({
            key: "gamePage"
        });
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
