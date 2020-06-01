const wechat = require('../../utils/promise.js');
var user_info = {};

// console.log(arr.sort(compare));

Page({

  /** 
   * 页面的初始数据
   */
  data: {
    userList: [],
    rank: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wechat.getStorage("user_info").then(res => {
      user_info = res.data;
      return wechat.callFunction("getUsers");
    }, err => { }).then(res => {
      // console.log(res.result.data);
      var users = res.result.data;
      console.log(users);
      // console.log(users);
      var tmp = {};
      var userTmp = [];
      var rank;
      for (var i = 0; i < users.length; i++) {
        tmp.nickname = users[i].nickname;
        tmp.avatarUrl = users[i].avatarUrl;
        tmp.exp = users[i].data.exp;
        tmp._id = users[i]._id
        // this.data.userList.add(tmp);
        userTmp.add(tmp);
      }
      userTmp.sort(cmp);
      // console.log(userTmp);
      for (var i = 0; i < userTmp.length; i++) {
        if (user_info._id == userTmp[i]._id) {
          rank = i;
          break;
        }
      }
      // console.log(user_info);
      this.setData({
        userList: userTmp,
        rank: rank ? rank : "∞"
      });
    }, err => {
      console.log("!");
    });

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
});


var cmp = function (obj1, obj2) {
  var val1 = obj1.exp;
  var val2 = obj2.exp;
  if (val1 < val2) {
    return -1;
  } else if (val1 > val2) {
    return 1;
  } else {
    return 0;
  }
}