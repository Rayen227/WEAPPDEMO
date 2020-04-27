let wechat = require('../../utils/promise.js');

Page({
    data: {},
    onLoad: function () {
        wechat.getStorage("user_info").then(res => {
            user_info = res.data;
            return wechat.callFunction("pull", {
                key: user_info,
                where: { openid: user_info.basic.openid }
            });
        }, err => { }).then(res => {
            user_info = time.compare(user_info.update_time, res.result.data.update_time) ? user_info : res.result.data;
            user_info.update_time = time.getTime();
            return wechat.setStorage("user_info", user_info);
        }, err => { console.log("!callFunction ERROR: ", err); }).then(res => {
            return wechat.callFunction("push", {
                key: "users",
                where: { openid: user_info.basic.openid },
                data: user_info
            });
        }, err => { console.log("!callFunction ERROR: ", err); })
    },
    startGameHandle: function () {
        wx.navigateTo({

        })
    }
});