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
    console.log(options);
    let that = this;
    var word;
    wx.getStorage({
      key: "gamePage",
      success: function (res) {
        word = res.data.options[options.item];
        console.log(word);
        wx.cloud.getTempFileURL({
          fileList: [word.mp3],
          success: res => {
            word.mp3 = res.fileList[0].tempFileURL;
            that.setData({
              word: word
            });
          },
          fail: console.error
        })
      }
    });
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