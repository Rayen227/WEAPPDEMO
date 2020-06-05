let wechat = require('../../../utils/promise.js');
var user_info;
var words = [];
Page({

  data: {
    word: {},
    isStar: false
  },

  onLoad: function (options) {
    let that = this;
    var word = {};
    wx.showToast({
      icon: 'loading',
      duration: 1500
    });
    wechat.getStorage("user_info").then(res => {
      user_info = res.data;
      if (options.flag == "0") {
        wx.getStorage({
          key: "gamePage",
          success: function (res) {
            word = res.data.options[options.item];
            wx.cloud.getTempFileURL({
              fileList: [word.mp3],
              success: res => {
                word.mp3 = res.fileList[0].tempFileURL;
                that.setData({
                  word: word
                });
              },
              fail: console.error
            });
          }
        });
      } else {
        word.en = options.en;
        word.ch = options.ch;
        word.accent = options.accent;
        word.jpg = options.jpg;
        word.mp3 = options.mp3;
        word.sentenceEn = options.sentenceEn;
        word.sentenceCh = options.sentenceCh;
        wx.cloud.getTempFileURL({
          fileList: [word.mp3],
          success: res => {
            word.mp3 = res.fileList[0].tempFileURL;
            that.setData({
              word: word
            });
          },
          fail: console.error
        });
      }
    }, err => { }).then(empty => {
      var tmp = user_info.word_tag.collected;
      words = [];
      for (var i = 0; i < tmp.length; i++) {
        words.add(tmp[i].en);
      }
      that.setData({
        isStar: words.includes(word.en) ? true : false
      });
    });

  },
  playMp3: function () {
    var audio = wx.createInnerAudioContext();
    audio.src = this.data.word.mp3;
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
        duration: 800
      });
      user_info.word_tag.collected.add(that.data.word);
      that.setData({
        isStar: true
      });
      words.add(that.data.word.en);
    } else {//已收藏
      that.setData({
        isStar: false
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