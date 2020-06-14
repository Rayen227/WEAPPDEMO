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
        tmp.avatarUrl = users[i].avatarUrl;
        tmp.exp = users[i].data.exp;
        tmp._id = users[i]._id;
        tmp.level = users[i].data.level;
        userTmp.add(tmp);
      }
      console.log(userTmp);
      userTmp.sort(cmp);
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


var cmp = function (obj1, obj2) {
  var val1 = obj1.exp;
  var val2 = obj2.exp;
  if (val1 < val2) {
    return 1;
  } else if (val1 > val2) {
    return -1;
  } else {
    return 0;
  }
}