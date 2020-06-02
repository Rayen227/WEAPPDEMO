// pages/wordDetails/wordDetails.js
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