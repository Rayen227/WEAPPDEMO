function update(user) {
    this.details = user.details;
    this.update_time = time.getTime();
}
function cmp(local, cloud) {
    return time.compare(local.update_time, cloud.update_time) ? local : cloud;
}


var basic = {};//系统获取的用户信息//包括sha1加密的openid
var data = {};//游戏所用到的信息
var update_time = {};//上一次更新的时间

//!归入data成员
//var items = [];//玩家拥有的道具列表


//传入打包好的user对象的成员信息
var init = function (obj) {
    basic = obj.basic;
    data = obj.data;
    update_time = obj.update_time;
    items = obj.items;
}

//用于login页面以外的其他页面进行数据的初始化
var asyncInit = function () {
    var local, cloud;
    //缓存中的user_info储存User实例化对象所具有的数据成员(不包含函数)
    wechat.getStorage("user_info").then(res => {
        console.log(res);
        //local = res.data;
        return wechat.callFunction("pull", {
            key: 'user'
        });
    }, err => { }).then(res => {
        console.log(res);
        //cloud = res;
    }, err = {}).then(jdg => {
        var tmp = cmp(local, cloud);
        tmp.update_time = time.getTime();
        return wechat.setStorage("user", tmp);
    }).then(res => {
        console.log(tmp, "缓存更新");
        return wechat.callFunction("push", {
            key: 'user',
            data: tmp
        });
    }, err => { }).then(res => {
        console.log(res, "云更新");
    }, err => { console.log(err, "云更新失败") }).then(empty => {
        update(tmp);//全局更新
    })

}

//根据答对的单词获取一定的经验值
var getPoint = function (word) {

}

module.exports = {
    init: init,
    asyncInit: asyncInit,
    getPoint: getPoint,
    basic: basic,
    data: data,
    update_time: update_time
}
