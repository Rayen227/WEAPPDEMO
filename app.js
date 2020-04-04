//云开发环境初始化
wx.cloud.init({
  env: "elay-pvyjb"
});


//app.js
App({});


//添加数组成员函数
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

Array.prototype.remove = function (index) {
	this.splice(index, 1);
};


