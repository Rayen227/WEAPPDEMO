function update(user) {
    this.details = user.details;
    this.update_time = time.getTime();
}
function cmp(local, cloud) {
    return time.compare(local.update_time, cloud.update_time) ? local : cloud;
}


var basic = {};//系统获取的用户信息
var data = {};//游戏所用到的信息
var update_time = {};//上一次更新的时间
var items = [];//玩家拥有的道具列表


//以系统获取的用户信息为参数
var asyncInit = function (basic) {
    var local, cloud;
    wechat.getStorage("user").then(res => {
        local = res.data;
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
    asyncInit: asyncInit,
    getPoint: getPoint,
    basic: basic,
    data: data,
    update_time: update_time,
    items: items
}
