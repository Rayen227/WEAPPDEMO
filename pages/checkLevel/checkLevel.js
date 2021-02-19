let wechat = require('../../utils/promise.js');
var isTesting = true;
// pages/checkLevel/checkLevel.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        levelItems: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        selectable: [],
        level: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        wechat.getStorage("user_info").then(res => {
            var level = res.data.data.level
            that.data.selectable.memset(12, false);
            for (var i = 0; i <= level; i++) {
                that.data.selectable[i] = true;
            }
            that.setData({
                selectable: that.selectable
            });
        }, err => { });
    },

    select(e) {
        wx.navigateTo({
            url: '../games/games?level=' + e.currentTarget.dataset.id,
            success: (result) => {

            },
            fail: () => { },
            complete: () => { }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})