//云开发环境初始化
wx.cloud.init({
  env: "elay-pvyjb"
});
var bgm;
//app.js
App({});


//添加数组成员函数
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

Array.prototype.remove = function (index) {
  this.splice(index, 1);
};

Array.prototype.add = function (item) {
  this.splice(this.length, 0, item);
};

Array.prototype.memset = function (cnt, value) {
  for (var i = 0; i < cnt; i++) {
    this[i] = value;
  }
};

String.prototype.intercept = function (l, r) {
  let tmp = [];
  var k = 0;
  for (var i = l; i < r; i++) {
    tmp[k++] = this[i];
  }
  return tmp.join('');
};
