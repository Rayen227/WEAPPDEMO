let wechat = require('../../../utils/promise.js');
Page({

  data: {
    word: {}
  },

  onLoad: function (options) {
    let that = this;
    var word = {};
    wx.showToast({
      icon: 'loading',
      duration: 1500
    });
    // console.log(options);
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
      console.log(word);
      that.setData({
        word: word
      });
    }

  },
  playMp3: function () {
    audio(this.data.word.mp3, false);
  },
  starWord: function () {
    var user_info;
    var that = this;
    var collected;
    wechat.getStorage("user_info").then(res => {
      user_info = res.data;
      collected = user_info.word_tag.collected;
      collected[collected.length] = that.data.word;
      user_info.word_tag.collected = collected;
      return wechat.setStorage("user_info", user_info);
    }, err => { })
  },
  onUnload: function () {
    wx.removeStorage({
      key: "gamePage"
    });
  }
});