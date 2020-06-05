let wechat = require('../../utils/promise.js');
var user_info;
var curTag = 'mistaken';
Page({
  data: {
    wordList: []
  },
  onLoad: function (options) {
    var that = this;
    wechat.getStorage('user_info').then(res => {
      user_info = res.data;
      that.setData({
        wordList: user_info.word_tag.mistaken
      });
    }, err => { });
  },
  showCompleted: function () {
    curTag = 'completed';
    this.setData({
      wordList: user_info.word_tag.completed
    });
  },
  showMistaken: function () {
    curTag = 'mistaken';
    this.setData({
      wordList: user_info.word_tag.mistaken
    });
  },
  showCollected: function () {
    curTag = 'collected';
    this.setData({
      wordList: user_info.word_tag.collected
    });
  },
  showDetails: function (e) {
    var index = e.currentTarget.dataset.index;
    var words = user_info.word_tag[curTag];
    wx.navigateTo({
      url: '../game/wordDetails/wordDetails?en=' + words[index].en + '&ch=' + words[index].ch + '&accent=' + words[index].accent + '&mp3=' + words[index].mp3 + '&jpg=' + words[index].jpg + '&sentenceEn=' + words[index].sentenceEn + '&sentenceCh=' + words[index].sententCh + '&power=' + words[index].power + '&last_view_time=' + words[index].last_view_time
    });
  },
  setCompleted: function (e) {
    var index = e.currentTarget.dataset.index;
    var words = user_info.word_tag[curTag];
    words.remove(index);
    user_info.word_tag.completed = words;
    wechat.setStorage('user_info', user_info);
  }
});