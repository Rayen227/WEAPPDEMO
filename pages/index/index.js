let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');
const db = wx.cloud.database();
var user_info = {};
Page({
    data: {},
    onLoad: function () {
        wechat.getSetting().then(res => {
            if (!res.authSetting['scope.userInfo']) {
                wx.navigateTo({
                    url: '../login/login'
                })
            }
            return wechat.getStorage("user_info");
        }, err => { }).then(res => {
            user_info = res.data;
            return wechat.callFunction("pull", {
                key: "users",
                where: { openid: user_info.basic.openid }
            });
        }, err => { }).then(res => {
            // user_info = time.compare(user_info.update_time, res.result.data.update_time) ? user_info : res.result.data;
            console.log(res.result);
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
        wx.redirectTo({
            url: '../game/game'
        })
    }
});


// wechat.callFunction("pull", {
//     key: "users",
//     where: {
//         openid: "155a72dc45b86fc324b9649a89b59d717164fc7f"
//     }
// }).then(res => {
//     console.log("测试结果：", res.result.data[0]);
// }, err => { })
