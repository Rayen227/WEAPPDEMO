/**
 * Promise化小程序接口
 */
class Wechat {
  /**
   * @return {Promise} 
   */

  static getStorage(key){
    return new Promise((resolve, reject)=>wx.getStorage({
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

  static setStorage(key, value) {
    return new Promise((resolve, reject) => wx.setStorage({
      key: key, data: value,
      success: resolve, fail: reject
    }))
  }

  static showModal(content, mode){
    return new Promise((resolve, reject) => wx.showModel({
      title: mode=="confirm" ? '请确认' : '警告',
      content: content,
      confirmColor: mode=="confirm" ? 'green' : '',
      cancelColor: mode=="warn" ? 'red' : '',
      success: resolve, fail: reject
    }))
  }

  static setTime(time){
    return new Promise((resolve, reject) => setTimeout(resolve, time));
  }

  static navigateTo(url){
     return new Promise((resolve, reject) => wx.navigateTo({
      url: url
     }))

  }

  static redirectTo(url){
     return new Promise((resolve, reject) => wx.redirectTo({
      url: url
     }))
  }

  static switchTab(url){
     return new Promise((resolve, reject) => wx.switchTab({
      url: url
     }))
  }

  static getSetting(authSetting) {
    return new Promise((resolve, reject) => wx.getSetting({
      authSetting: authSetting
    }))
  }

  static getUserInfo(avatarUrl, userInfo) {
    return new Promise((resolve, reject) => wx.getUserInfo({
      avatarUrl: avatarUrl,
      userInfo: userInfo
    }))
  }

  
};

module.exports = Wechat;