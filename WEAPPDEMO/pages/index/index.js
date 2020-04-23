//index.js
// const app = getApp()
// const DB = wx.cloud.database();
// let wechat = require('../../promise.js');
let DB = wx.cloud.database().collection("users");
let wechat = require('../../utils/promise.js');



Page({ 
  data: {
    open: false,
    avatarUrl: '',
    userInfo: {},
    logined: false,
    ranking:"",
  },
 


// 改变显示的值的同时获取该用户的段位信息
  changeHandle: function () {
    var that = this;
    wx.cloud.database().collection("users").get({
      success(res){
          console.log("获取段位信息成功",res.data[0].ranking),
           
          that.setData({
            ranking: res.data[0].ranking
          }),
            console.log(list)
      },
      fail(res){
          console.log("获取段位数据信息失败",res)
      }
    })
    this.setData({
      open : true,

    })
  },

  onLoad: function () {
   
  
  },
  // 这只是一个普通的事件处理函数
  onGetUserInfo:function(e) {
    if (!this.data.logined && e.detail.userInfo) {
      this.setData({
        logined: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      
    }
  }
})
