// pages/wordDetails/wordDetails.js
let wechat = require('../../../utils/promise.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    word: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
    wx.createAudioContext("mp3").play();
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorage({
      key: "gamePage"
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})