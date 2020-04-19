

let wechat = require('../../utils/promise.js');

Page({
   data:{
     name:"",
     logined:false,
     avatarUrl:""
  },
  getUserInfo: function (e) {
    let that = this;
    console.log(e)
  //  获取用户信息
   
// 下面的是能运行的，上面的这部分是真的运行不了
    wx.getSetting({
      success(res) {
        // console.log("res", res)
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权=====")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log("获取用户信息成功", res)
              that.setData({
                name: res.userInfo.nickName
              })
            },
            fail(res) {
              console.log("获取用户信息失败", res)
            }
          })
        } else {
          console.log("未授权=====")
          that.showSettingToast("请授权")
        }
      }
    })
  },


  onGetUserInfo: function (e) {
    if (!this.data.logined && e.detail.userInfo) {
      this.setData({
        logined: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })

    }
  },

  // 打开权限设置页提示框
  showSettingToast: function (e) {
    wechat.showModal("content","mode").then(res=> {
      title = '提示！';
      confirmText = '去设置';
      showCancel = false;
      content = e;
      if(res.confirm) {
        wechat.navigateTo("url").then(res=> {
          url = '../seting/seting'
        })
      }
    })



    // 上面这段是改动过的，下面这个是没有改动过的
    wx.showModal({
      title: '提示！',
      confirmText: '去设置',
      showCancel: false,
      content: e,
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../setting/setting',
          })
        }
      }
    })
  },
 
})


