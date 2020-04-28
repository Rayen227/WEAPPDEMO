let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');
let sha = require('../../utils/HASH_SHA1.js');
const db = wx.cloud.database();
Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    onLoad: function () {

    },

    bindGetUserInfo: function (e) {
        if (e.detail.userInfo) {
            var tmp = e.detail.userInfo;
            console.log(e.detail.userInfo);
            console.log(tmp);
            wechat.callFunction("getOpenId").then(res => {
                var openid = sha.SHA1(res.result.openId);
                var user_info = {
                    nickname: tmp.nickName,
                    avatarUrl: tmp.avatarUrl,
                    openid: openid,
                    data: { level: 0, exp: 0, items: [] },
                    update_time: time.getTime(),
                    word_tag: {
                        completed: [],
                        mistaken: [],
                        collected: []
                    }
                }
                console.log(user_info);
                return wechat.setStorage("user_info", user_info)
            }, err => { }).then(res => {
                // return wechat.callFunction("push", { key: "users", data: user_info })
                db.collection("users")
            }, err => { }).then(res => {
                return wechat.setStorage("word_list", []);
            }, err => { }).then(res => {
                wx.switchTab({
                    url: '../index/index'
                })
            }, err => { });





        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '授权失败，请您检查手机或网络状态后再试',
                showCancel: false,
                confirmText: '确定',
                success: function (res) {
                    // 用户没有授权成功，不需要改变 isHide 的值
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”');
                    }
                }
            });
        }
    }
})
