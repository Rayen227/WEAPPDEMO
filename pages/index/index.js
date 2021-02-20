let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');
let getSegment = require('../../utils/getSegment.js');
const db = wx.cloud.database();
var user_info = {};
// var word_set;
// var bgm;
// var hardPaused = false;
var gameBack = false;
var loginBack = false;
var lastTime;
Page({
    data: {
        avatarUrl: '',
        animation1: {},
        animation2: {},
        segment: "",
        level: 0,
        mistake: ''
    },
    onLoad: function () {
        var openId;
        var that = this;
        var user_cloud;
        wx.showLoading({
            title: 'Loading',
            duration: 1500
        });
        wechat.callFunction("getOpenId").then(res => {
            openId = res.result.openId;
            return wechat.callFunction("getUser", { _openid: openId });
        }, err => { }).then(res => {
            user_cloud = res.result.data[0];
            if (!user_cloud) {
                wx.navigateTo({
                    url: '../login/login'
                });
            }
            return wechat.getStorage("user_info");
        }, err => { }).then(res => {
            lastTime = user_cloud.update_time.timestamp;
            user_info = res.data.update_time.timestamp > user_cloud.update_time.timestamp ? res.data : user_cloud;
            if (res.data.update_time.timestamp <= user_cloud.update_time.timestamp) {
                console.log("Updated by cloud data");
            }
            user_info.update_time = time.getTime();
            return wechat.callFunction("updateUser", {
                _openid: user_info._openid,
                data: {
                    data: user_info.data,
                    update_time: user_info.update_time,
                    word_tag: user_info.word_tag,
                    unpassed: user_info.unpassed
                }
            });
        }, err => { //缓存丢失
            console.log("Local storage not found!Reset by the lastest cloud stroage!");
            user_info = user_cloud;
            wechat.setStorage("user_info", user_cloud);
        }).then(res => {
            that.setData({
                avatarUrl: user_info.avatarUrl,
                segment: getSegment(user_info.data.level),
                level: user_info.data.level
            });
            return wechat.setStorage("user_info", user_info);
        }, err => { }).then(res => {
            //版本更新
            var word_set;
            if (lastTime < 1613827545000) {
                console.log("Version updated");
                wechat.callFunction("getSTDWordset").then(res => {
                    word_set = res.result.data;
                    return wechat.setStorage("STDWordset", word_set);
                }, err => {
                    console.log(err);
                }).then(res => {
                    user_info["unpassed"] = word_set[user_info.data.level].words;
                    return wechat.setStorage("user_info", user_info)
                }, err => {
                    console.log(err);
                }).then(res => {
                    user_info.update_time = time.getTime();
                    return wechat.callFunction("updateUser", {
                        _openid: user_info._openid,
                        data: {
                            data: user_info.data,
                            update_time: user_info.update_time,
                            word_tag: user_info.word_tag,
                            unpassed: user_info.unpassed
                        }
                    });
                }, err => {
                    console.log(err);
                });
            }
        })
        // .then(res => {
        //     return wechat.callFunction("getSTDWordset");
        // }, err => { console.log(err); }).then(res => {
        //     word_set = res.result.data;
        //     return wechat.setStorage("STDWordset", res.result.data);
        // }, err => { console.log(err); }).then(res => {
        //     user_info.unpassed = word_set[user_info.data.level].words;
        //     console.log(user_info);
        //     return wechat.callFunction("updateUser", {
        //         _openid: user_info._openid,
        //         data: {
        //             data: user_info.data,
        //             update_time: user_info.update_time,
        //             word_tag: user_info.word_tag,
        //             unpassed: user_info.unpassed
        //         }
        //     });
        // }, err => { console.log(err); });
    },
    startGameHandle: function () {
        // bgm.pause();
        gameBack = true;
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: 'linear'
        })
        animation.scale(1.1, 1.1).step(1);
        animation.scale(1, 1).step(2);
        this.setData({
            animation1: animation
        });
        wx.navigateTo({
            url: '../checkLevel/checkLevel',
            success: res => {

            },
            fail: err => {
                console.log(err);
            }
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
        });
        wx.navigateTo({
            url: '../miniSpace/miniSpace'
        });
    },
    toDefinition: function () {
        // bgm.pause();
        this.setData({
            mistake: 'mistake-hover'
        });
        wx.navigateTo({
            url: '../mistake/mistake'
        });
    },
    showRanking: function () {
        wx.navigateTo({
            url: '../ranking/ranking'
        });
    },
    onHide: function () {
        this.onLoad();
    },
    onShow: function () {
        // if (bgm && !hardPaused && gameBack && !loginBack) {
        //     bgm.play();
        // }
        this.setData({
            mistake: ''
        });
    },
    // stopBgm: function () {
    //     // hardPaused = hardPaused ? true : false;
    //     hardPaused = true;
    //     if (bgm.paused) {
    //         bgm.play();
    //         hardPaused = false;
    //     } else {
    //         bgm.stop();
    //     }
    // },
    onPullDownRefresh() {
        this.onLoad();
    },
});

// var a = "，";

// console.log(a.replace(/[^\u0000-\u00ff]/g, "aa").length, a);