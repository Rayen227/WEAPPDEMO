

let wechat = require('../../utils/promise.js');

Page({
   data:{
     name:"",
     logined:false,
     avatarUrl:"",
     authSetting:""
  },
  onLoad: function () {
    var that = this;
    wechat.getSetting("authSetting").then(res => {
      if (res.authSetting['scope.userInfo']) {
        console.log(res.authSetting);
        return wechat.getUserInfo()
      }
    }, err => { console.log("获取用户信息失败", err) }).then(res => {
      if(res)
      { 
      that.setData({
      avatarUrl : res.userInfo.avatarUrl,
      name : res.userInfo.nickName,
      logined: true,
      })
      console.log('获取头像地址成功',res.userInfo),
      console.log(res.userInfo.avatarUrl)
      }
      else {
        return wechat.showModal("请求授权","warn");
      }
    },err => {console.log('获取头像地址 失败',err)} )
     
  },
  changeHandle:function() {
    wechat.switchTab("../index/index").then(res=> {

    })
  }
  
 
})


