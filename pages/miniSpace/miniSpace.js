Page({
    data: {
    },
    onLoad: function () {
        wx.getStorage({
            key: 'user_info',
            success: (res) => {
                user_info = res.data;
            },
            fail: () => { },
            complete: () => { }
        });
    }
})