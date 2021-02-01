var isTesting = true;
// pages/checkLevel/checkLevel.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        levelItems: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        level: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    select(e) {
        console.log(e.currentTarget.dataset.id);
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