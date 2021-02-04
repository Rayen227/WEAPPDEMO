let wechat = require('../../utils/promise.js');
var user_info;
var words = [];
var emptyStar = 'https://7465-test-h043w-1301939913.tcb.qcloud.la/images/worddetails/4b95d6b69571e8d8a2a30717f340343.png?sign=89e05f5f9108a23c18c220ccb482b027&t=1591455811';
var fullStar = 'https://7465-test-h043w-1301939913.tcb.qcloud.la/images/worddetails/be261f3ee4b00ce0501db5f580943b0.png?sign=fe54b08a74700d055cf7c178824db75e&t=1591455799';
Page({
    data: {
        word: {},
        isStar: false,
        starUrl: ''
    },

    onLoad: function () {
        let that = this;
        var word = {};
        var isStar;
        wx.showLoading({
            title: 'Loading',
            duration: 1500
        });
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
        audio.src = word.mp3;
        audio.onError(err => {
            console.log(err);
        });
        audio.play();
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

    },
    onUnload: function () {
        wx.removeStorage({
            key: "gamePage"
        });
    }
});