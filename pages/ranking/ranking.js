const wechat = require('../../utils/promise.js');
let getSegment = require('../../utils/getSegment.js');
var user_info = {};
Page({
    data: {
        userList: [],
        segmentList: [],
        rank: null,
        user_info: {},
        segment: ""
    },
    onLoad: function (options) {
        var that = this;
        var segmentList = [];
        wx.showLoading({
            title: 'Loading',
            duration: 1200
        });
        wechat.getStorage("user_info").then(res => {
            user_info = res.data;
            return wechat.callFunction("getUsers");
        }, err => { }).then(res => {
            var users = res.result.data;
            var tmp = {};
            var userTmp = [];
            var rank;
            for (var i = 0; i < users.length; i++) {
                tmp = {};
                tmp.nickname = users[i].nickname;
                console.log(tmp.nickname, tmp.nickname.replace(/[^\u0000-\u00ff]/g, "aa").length);
                if (tmp.nickname.replace(/[^\u0000-\u00ff]/g, "aa").length > 10) {
                    tmp.nickname = cut(tmp.nickname);
                }
                tmp.avatarUrl = users[i].avatarUrl;
                tmp.exp = users[i].data.exp;
                tmp._id = users[i]._id;
                tmp.level = users[i].data.level;
                userTmp.add(tmp);
            }
            userTmp.sort(function (a, b) {
                if (a.level < b.level) return 1;
                else if (a.level > b.level) return -1;
                else if (a.exp < b.exp) return 1;
                else if (a.exp > b.exp) return -1;
            });
            for (var i = 0; i < userTmp.length && i < 100; i++) {
                if (user_info._id == userTmp[i]._id) {
                    rank = i + 1;
                }
                segmentList.add(getSegment(userTmp[i].level));
            }
            this.setData({
                userList: userTmp,
                rank: rank ? rank : "100+",
                user_info: user_info,
                segmentList: segmentList,
                segment: getSegment(user_info.data.level)
            });
        }, err => {
            console.log("!");
        });

    }
});

function cut(str) {
    var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
    var cnt = 0;
    var str_cut = "";
    for (var i = 0; i < str.length; i++) {
        if (reg.test(str[i]))
            cnt += 2;
        else cnt++;
        if (cnt >= 7) break;
        str_cut += str[i];
    }
    return str_cut + "..";
}