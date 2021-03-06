/**
 * Promise化小程序接口
 */
class Wechat {


  static getStorage(key) {
    return new Promise((resolve, reject) => wx.getStorage({
      key: key,
      success: resolve, fail: reject
    }))
  };

  static setStorage(key, value) {
    return new Promise((resolve, reject) => wx.setStorage({
      key: key, data: value,
      success: resolve, fail: reject
    }))
  }

  static callFunction(name) {
    return new Promise((resolve, reject) => wx.cloud.callFunction({
      name: name,
      success: resolve, fail: reject
    }))
  };

  static callFunction(name, event) {
    return new Promise((resolve, reject) => wx.cloud.callFunction({
      name: name,
      data: event,
      success: resolve, fail: reject
    }))
  }

  static setStorage(key, value) {
    return new Promise((resolve, reject) => wx.setStorage({
      key: key, data: value,
      success: resolve, fail: reject
    }))
  }

  static setTime(time) {
    return new Promise((resolve, reject) => setTimeout(resolve, time));
  }

  static navigateTo(url) {
    return new Promise((resolve, reject) => wx.navigateTo({
      url: url
    }))
  }

  static redirectTo(url) {
    return new Promise((resolve, reject) => wx.redirectTo({
      url: url
    }))
  }

  static switchTab(url) {
    return new Promise((resolve, reject) => wx.switchTab({
      url: url
    }))
  }


  static getSetting() {
    return new Promise((resolve, reject) => wx.getSetting({
      success: resolve, fail: reject
    }))
  }

  static getTempFileUrl(list) {
    return new Promise((resolve, reject) => wx.cloud.getTempFileURL({
      fileList: list,
      success: resolve,
      fail: reject
    }))
  }

};

module.exports = Wechat;