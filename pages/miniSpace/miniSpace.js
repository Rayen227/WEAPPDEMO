let wechat = require('../../utils/promise.js');
let itemList = require('../../utils/itemList.js');
var user_info;
var items;
var itemCount = 28;//道具总数
Page({
    data: {
        isOwned: [],
        itemList: []
    },
    onLoad: function () {
        var that = this;
        wechat.getStorage('user_info').then(res => {
            user_info = res.data;
            items = user_info.data.items;
            var isOwned = [];
            isOwned.memset(itemCount, false);
            for (var i = 0; i < items.length; i++) {
                isOwned[items[i]] = true;
            }
            that.setData({
                isOwned: isOwned,
                itemList: itemList
            });
            console.log(that.data);
        }, err => { });
    }
});