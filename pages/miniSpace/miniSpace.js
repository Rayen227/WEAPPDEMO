var startPoint;
var user_info = {};
var position_list = { nameA: [0, 0], nameB: [100, 100] }
Page({
    data: {
        buttonTop: 0,
        buttonLeft: 0,
        items: []
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
    },
    // button拖动的三个方法

    buttonStart: function (e) {
        startPoint = e.touches[0];
        // console.log(startPoint);
    },
    buttonMove: function (e) {
        var endPoint = e.touches[e.touches.length - 1];
        var translateX = endPoint.clientX - startPoint.clientX;
        var translateY = endPoint.clientY - startPoint.clientY;
        startPoint = endPoint;
        var buttonTop = this.data.buttonTop + translateY;
        var buttonLeft = this.data.buttonLeft + translateX;

        this.setData({
            buttonTop: buttonTop,
            buttonLeft: buttonLeft
        });
    },
    buttonEnd: function (e) {
        // console.log(e);
        // var endPoint = e.changedTouches[0]
        // this.setData({
        //     buttonTop: (endPoint.clientY - 20),
        //     buttonLeft: (endPoint.clientX - 50)
        // })
    }
})
