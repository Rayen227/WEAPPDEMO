let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');
let getSegment = require('../../utils/getSegment.js');
const db = wx.cloud.database();
var user_info = {};
// var bgm;
// var hardPaused = false;
var gameBack = false;
var loginBack = false;
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
        wx.showLoading({
            title: 'Loading',
            duration: 1200
        });
        wechat.callFunction("getOpenId").then(res => {
            openId = res.result.openId;
            return wechat.callFunction("getUser", { _openid: openId });
        }, err => { }).then(res => {
            user_info = res.result.data[0];
            if (!user_info) {
                wx.navigateTo({
                    url: '../login/login'
                });
            }
            return wechat.getStorage("user_info");
        }, err => { }).then(res => {
            user_info = res.data;//以缓存为准
            user_info.update_time = time.getTime();
            return wechat.callFunction("updateUser", {
                _openid: user_info._openid,
                data: {
                    data: user_info.data,
                    update_time: user_info.update_time,
                    word_tag: user_info.word_tag
                }
            });

        }, err => { //缓存丢失
            console.log("Local storage lost!Reset by the last cloud stroage!");
            wechat.setStorage("user_info", user_info);
        }).then(empty => {
            that.setData({ avatarUrl: user_info.avatarUrl })
            // if (bgm && bgm.paused) {
            //     bgm.play();
            // }
        });
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
        })
        wx.navigateTo({
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

// console.log(a.replace(/[^\u0000-\u00ff]/g, "aa").length);