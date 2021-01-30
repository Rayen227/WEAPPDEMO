let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');
const db = wx.cloud.database();
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
                var openid = res.result.openId;
                var user_info = {
                    nickname: tmp.nickName,
                    avatarUrl: tmp.avatarUrl,
                    data: { level: 0, exp: 0, items: [] },
                    update_time: time.getTime(),
                    word_tag: {
                        completed: [],
                        mistaken: [],
                        collected: []
                    }
                };

                db.collection("users").add({
                    data: user_info,
                    success: function () {
                        db.collection("users").where({ _openid: openid }).get({
                            success: function (res) {
                                console.log(res.data[0]);
                                user_info = {
                                    _id: res.data[0]._id,
                                    _openid: openid,
                                    nickname: tmp.nickName,
                                    avatarUrl: tmp.avatarUrl,
                                    data: { level: 0, exp: 0, items: [] },
                                    update_time: time.getTime(),
                                    word_tag: {
                                        completed: [],
                                        mistaken: [],
                                        collected: []
                                    }
                                };
                                wx.setStorage({
                                    key: "user_info",
                                    data: user_info,
                                    success: function () {
                                        wechat.callFunction("getSTDWordset").then(res => {
                                            console.log(res);
                                            return wechat.setStorage("STDWordset", res.result.data);
                                        }, err => { console.log(err); }).then(res => {
                                            wx.redirectTo({
                                                url: '../index/index'
                                            });
                                        })
                                    }
                                })
                            }
                        })
                    }
                });

            })
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
