class time {
    static getTime() {//返回时间对象
        var now = new Date();
        var _year = now.getFullYear();
        var _month = now.getMonth() + 1;
        var _date = now.getDate();
        var _hour = now.getHours();
        var _minute = now.getMinutes();
        var _second = now.getSeconds();
        var _timestamp = Date.parse(new Date());

        return { year: _year, month: _month, date: _date, hour: _hour, minute: _minute, second: _second, timestamp: _timestamp };
    }
}

module.exports = time;