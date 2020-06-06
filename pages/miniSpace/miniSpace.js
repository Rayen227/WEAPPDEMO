let wechat = require('../../utils/promise.js');
var user_info;
var itemCount = 13;//道具总数
Page({
    data: {
        isOwned: []
    },
    onLoad: function () {
        var that = this;
        var items;
        wx.showToast({
            icon: 'loading',
            duration: 1000
        });
        wechat.getStorage('user_info').then(res => {
            user_info = res.data;
            items = user_info.data.items;
            var isOwned = [];
            isOwned.memset(itemCount, false);
            for (var i = 0; i < items.length; i++) {
                isOwned[items[i]] = true;
            }
            that.setData({
                isOwned: isOwned
            });
            console.log(that.data);
        }, err => { });
    }
});