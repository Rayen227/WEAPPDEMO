let wechat = require('../../../utils/promise.js');
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

  onLoad: function (options) {
    let that = this;
    var word = {};
    var isStar;
    wx.showLoading({
      title: 'Loading',
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
        // console.log(word);
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
    if (this.data.word.mp3 == "") {
      audio.src = "https://656c-elay-t6atq-1302369471.tcb.qcloud.la/words/" + word.en + ".mp3"
    } else {
      audio.src = word.mp3;
    }
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
      user_info.word_tag.collected.add(that.data.word);
      that.setData({
        isStar: true,
        starUrl: fullStar
      });
      words.add(that.data.word.en);
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