let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');
const db = wx.cloud.database();
var user_info = {};
Page({
    data: {
        avatarUrl: ''
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
            return wechat.callFunction("getUser", { _id: user_info._id });

        }, err => {//若玩家清除了数据缓存
            flag = 0;
            return wechat.callFunction("getUser", { _id: user_info._id });
        }).then(res => {
            var cloud = res.result.data;
            if (flag && time.compare(user_info.update_time, cloud.update_time)) {//缓存更新时间较晚
                //更新数据库
                user_info.update_time = time.getTime();
                db.collection("users").doc(user_info._id).update({
                    data: user_info
                });
            }
            else {//数据库更新时间较晚
                //跟新缓存
                cloud.update_time = time.getTime();
                wx.setStorage({
                    key: "user_info",
                    data: cloud
                });
            }
        }, err => { }).then(empty => {
            that.setData({
                avatarUrl: user_info.avatarUrl
            });
        })
    },
    startGameHandle: function () {
        wx.redirectTo({
            url: '../game/game'
        });
    }
});
