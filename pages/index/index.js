let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');
const db = wx.cloud.database();
var user_info = {};
Page({
    data: {
        avatarUrl: '',
        animation1: {},
        animation2: {}
    },
    onLoad: function () {
        var that = this;
        var flag = 1;
        wechat.getSetting().then(res => {
            if (!res.authSetting['scope.userInfo']) {
                wx.navigateTo({
                    url: '../login/login'
                });
            }
            return wechat.getStorage("user_info");
        }, err => { }).then(res => {
            user_info = res.data;
            that.setData({
                avatarUrl: user_info.avatarUrl
            });
            // console.log(user_info);
            return wechat.callFunction("getUser", { _id: user_info._id });
        }, err => {//若玩家清除了数据缓存, 重新授权
            wx.navigateTo({
                url: '../login/login'
            });

        }).then(res => {
            var cloud = res.result.data;
            if (flag && user_info.update_time.timestamp > cloud.update_time.timestamp) {//缓存更新时间较晚
                //更新数据库
                user_info.update_time = time.getTime();
                var tmp = {
                    avatarUrl: user_info.avatarUrl,
                    data: user_info.data,
                    nickname: user_info.nickname,
                    update_time: user_info.update_time,
                    word_tag: user_info.word_tag
                };
                console.log(tmp);
                db.collection("users").doc(user_info._id).update({
                    data: tmp,
                    success: function () {
                        console.log("更新成功");
                    },
                    fail: function (err) {
                        console.log("更新失败: ", err);
                    }
                });
            }
            else {//数据库更新时间较晚
                //更新缓存
                cloud.update_time = time.getTime();
                wx.setStorage({
                    key: "user_info",
                    data: cloud
                });
            }
        }, err => { console.log("!cloud.getUser ERROR: ", err); }).then(empty => {
        });
    },
    startGameHandle: function () {
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: 'linear'
        })
        animation.scale(1.1, 1.1).step(1);
        animation.scale(1, 1).step(2);
        this.setData({
            animation1: animation
        })
        wx.redirectTo({
            url: '../game/game'
        });
    },
    toMiniSpaceHandle: function () {
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: 'linear'
        })
        animation.scale(1.1, 1.1).step(1);
        animation.scale(1, 1).step(2);
        this.setData({
            animation2: animation
        })
        wx.redirectTo({
            url: '../miniSpace/miniSpace'
        });
    }
});
