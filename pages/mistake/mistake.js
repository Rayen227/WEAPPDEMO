let wechat = require('../../utils/promise.js');
var user_info;
var curTag = 'mistaken';
Page({
  data: {
    wordList: [],
    isCurrent: ['hovering', '', '']
  },
  onLoad: function (options) {
    wx.showLoading({
      title: 'Loading',
      duration: 300
    });
    var that = this;
    wechat.getStorage('user_info').then(res => {
      user_info = res.data;
      that.setData({
        wordList: user_info.word_tag.mistaken
      });
    }, err => { });
  },
  onShow: function () {
    this.onLoad();
  },
  showCompleted: function () {
    curTag = 'completed';
    this.setData({
      wordList: user_info.word_tag.completed,
      isCurrent: ['', '', 'hovering']
    });
  },
  showMistaken: function () {
    curTag = 'mistaken';
    this.setData({
      wordList: user_info.word_tag.mistaken,
      isCurrent: ['hovering', '', '']
    });
  },
  showCollected: function () {
    curTag = 'collected';
    this.setData({
      wordList: user_info.word_tag.collected,
      isCurrent: ['', 'hovering', '']
    });
  },
  showDetails: function (e) {
    var index = e.currentTarget.dataset.index;
    var words = user_info.word_tag[curTag];
    console.log(index, words);
    wx.navigateTo({
      url: '../game/wordDetails/wordDetails?en=' + words[index].en + '&ch=' + words[index].ch + '&accent=' + words[index].accent + '&mp3=' + words[index].mp3 + '&jpg=' + words[index].jpg + '&sentenceEn=' + words[index].sentenceEn + '&sentenceCh=' + words[index].sentenceCh + '&power=' + words[index].power + '&last_view_time=' + words[index].last_view_time
    });
  },
  setCompleted: function (e) {
    var index = e.currentTarget.dataset.index;
    var words = user_info.word_tag[curTag];
    var completed = user_info.word_tag.completed;
    var tmp = [];
    // console.log(completed);
    for (var i = 0; i < completed.length; i++) {
      tmp.add(completed[i].en);
    }
    console.log(words, index);
    if (!tmp.includes((words[index]).en)) {
      user_info.word_tag.completed.add(words[index]);
    }
    words.remove(index);
    user_info.word_tag[curTag] = words;
    this.setData({
      wordList: words
    })
    wechat.setStorage('user_info', user_info);
  }
});