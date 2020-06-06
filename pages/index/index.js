let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');
let getSegment = require('../../utils/getSegment.js');
const db = wx.cloud.database();
var user_info = {};
var bgm;
var hardPaused = false;
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
        var that = this;
        var flag = 1;
        wx.showToast({
            icon: 'loading',
            duration: 1000
        });
        wechat.getSetting().then(res => {
            wx.cloud.getTempFileURL({
                fileList: ['cloud://elay-pvyjb.656c-elay-pvyjb-1301343918/audio/miniSpace_bgm.mp3'],
                success: res => {
                    bgm = wx.createInnerAudioContext();
                    var url = res.fileList[0].tempFileURL;
                    bgm.loop = true;
                    bgm.src = url;
                    bgm.onError(err => {
                        console.log(err);
                    });
                },
                fail: console.error
            });
            if (!res.authSetting['scope.userInfo']) {
                loginBack = true;
                wx.navigateTo({
                    url: '../login/login'
                });
            }
            return wechat.getStorage("user_info");
        }, err => { }).then(res => {
            user_info = res.data;
            that.setData({
                avatarUrl: user_info.avatarUrl,
                level: user_info.data.level,
                segment: getSegment(user_info.data.level)
            });
            return wechat.callFunction("getUser", { _id: user_info._id });
        }, err => {//若玩家清除了数据缓存, 重新授权
            loginBack = true;
            wx.navigateTo({
                url: '../login/login'
            });
            return wechat.callFunction("getUser", { _id: user_info._id });

        }).then(res => {
            var cloud = res.result.data[0];
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
            if (bgm && bgm.paused) {
                // bgm.play();
            }

        });
    },
    startGameHandle: function () {
        bgm.pause();
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
    onUnload: function () {

    },
    onShow: function () {
        if (bgm && !hardPaused && gameBack && !loginBack) {
            bgm.play();
        }
        this.setData({
            mistake: ''
        });
    },
    stopBgm: function () {
        // hardPaused = hardPaused ? true : false;
        hardPaused = true;
        if (bgm.paused) {
            bgm.play();
            hardPaused = false;
        } else {
            bgm.stop();
        }
    }
});