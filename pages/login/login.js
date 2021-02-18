let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');
var isNewUser = false;
const db = wx.cloud.database();
var user_info = {};
var unpassed = [];
var openid = "";
var wordset = {};
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    bindGetUserInfo: function (e) {
        var that = this;
        wx.showLoading({
            title: 'Loading',
            duration: 1800
        });
        if (e.detail.userInfo) {
            var tmp = e.detail.userInfo;

            wechat.callFunction("getOpenId").then(res => {
                openid = res.result.openId;
                return wechat.callFunction("getSTDWordset");
            }).then(res => {
                wordset = res.result.data;
                return wechat.callFunction("getUser", { _openid: openid });
            }, err => {
                console.log("callFunction:getSTDWordset", err);
            }).then(res => {
                if (res.result.data.length != 0) {
                    console.log("User exist");
                    user_info = res.result.data[0];
                    user_info.update_time = time.getTime();
                } else {
                    console.log("User unfound");
                    isNewUser = true;
                    user_info = {
                        nickname: tmp.nickName,
                        avatarUrl: tmp.avatarUrl,
                        data: { level: 0, exp: 0, items: [] },
                        update_time: time.getTime(),
                        word_tag: {
                            completed: [],
                            mistaken: [],
                            collected: []
                        },
                        unpassed: wordset[0].words
                    };
                }
                return wechat.setStorage("user_info", user_info);
            }, err => {
                console.log("callFunction:getUser");
            }).then(res => {
                return wechat.setStorage("STDWordset", wordset);
            }, err => {
                console.log("setStorage:user_info", err);
            }).then(res => {
                if (isNewUser) {
                    user_info['_openid'] = openid;
                    return wechat.callFunction("addUser", { user_info: user_info });
                }
            }, err => {
                console.log("setStorage:STDWordset", err);
            }).then(res => {
                wx.redirectTo({
                    url: '../index/index'
                });
            }, err => {
                console.log("setStorage:unpassed", err);
            });

        } else {
            wx.showModal({
                title: '警告',
                content: '授权失败，请您检查手机或网络状态后再试',
                showCancel: false,
                confirmText: '确定',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”');
                    }
                }
            });
        }
    }
})
