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
        var that = this;
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
                                // console.log(res.data[0]);
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
                                        wx.redirectTo({
                                            url: '../index/index'
                                        });
                                    }
                                })
                            }
                        })
                    }
                })
            })
            // db.collection("word_list").get({
            //     success: function (res) {
            //         var word_list = res.result.data;
            //         console.log(word_list);
            //         that.setData({
            //             key: "word_list",
            //             data: word_list
            //         });
            //         wx.redirectTo({
            //             url: '../index/index'
            //         });
            //     }
            // })






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
