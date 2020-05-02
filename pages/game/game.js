let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');
let item_list = require('../../utils/items.js');

var user_info = {};
var word_list = [];
var listId = 0;
var true_option = 0;
var my_option = 0;
var problem = {};
var options = [];
var count = 0;

Page({
  data: {
    problem: {},
    options: [],
    // 要用到的动画参数的开始
    animationData0: {},
    animationData1: {},
    animationData2: {},
    animationData3: {},
    animationNextPage: {},
    animationWrongData0: {},
    animationWrongData1: {},
    animationWrongData2: {},
    animationWrongData3: {},
    // 要用到的动画参数的结束
    hover_class: ['', '', '', ''],
    selected: false,
    correct: false,
    // tips只用于demo版的
    tips: ""
    // 所以才特地圈起来，有了图之后可以删掉
  },
  onLoad: function () {
    var that = this;
    wechat.getStorage("word_list").then(res => {
      word_list = res.data;
      // console.log(word_list);
      if (word_list.length < 4) {//缓存中单词数量不足
        return wechat.callFunction("pull", { key: "word_list" }).then(res => {//云调用数据库更新
          //console.log(res.result.data);
          word_list = res.result.data;//DEBUG ONLY
          return wechat.setStorage("word_list", word_list);//同时写入缓存
        }, err => { console.log("!callFunction:pull, ERROR: ", err) });
      }
      // console.log(word_list);
    }, err => { console.log("!getStorage:word_list, ERROR: ", err) }).then(empty => {
      resetPage(that);
      return wechat.getStorage("user_info");
    }).then(res => {//获取用户信息
      user_info = res.data;
    }, err => { });
  },
  selectHandle: function (event) {
    // 动画效果的开始
    //   var animation = wx.createAnimation({
    //       duration: 200,
    //       timingFunction:'linear',
    //   })
    //   animation.translateY(-100).step(1);
    //   animation.translateY(0).step(2);
    //   // 动画效果的结束
    //   my_option = event.currentTarget.dataset.id;
    //   let word = word_list[listId];
    //   // console.log("selectHandle");
    //   var tmp = ['', '', '', ''];
    //   if (my_option == true_option) {
    //       //选对啦
    //       word.power--;
    //       count += Math.floor(Math.random() * 2);
    //       if (count >= 10) {
    //           var item = drawItem();
    //       }
    //       word.last_view_time = time.getTime().timestamp;
    //       if (word.power <= 0) {//权小于零则移除缓存记录
    //           word_list.remove(listId);
    //       }
    //       console.log(true);
    //       tmp[my_option] = 'answer-hover-true';
    //       this.setData({
    //           correct: true,
    //           selected: true,
    //           hover_class: tmp
    //       });
    //       // 选对了的跳动样式的开始
    //       if(my_option == 0) {
    //         this.setData({
    //           animationData0: animation
    //         })
    //       }
    //       else if(my_option == 1) {
    //         this.setData({
    //           animationData1 : animation
    //         })
    //       }
    //       else if (my_option == 2) {
    //         this.setData({
    //           animationData2: animation
    //         })
    //       }
    //       else if (my_option == 3) {
    //         this.setData({
    //           animationData3: animation
    //         })
    //       }
    //     // 选对了的跳动样式的结束

    //     // 选对了的旁边提示栏部分动画的开始
    //    var animationBottom1  = wx.createAnimation({
    //      duration:20,
    //      timingFunction:'linear'
    //    })
    //    animationBottom1.translateY(-60).step(1),
    //    animationBottom1.translateY(5).step(2),
    //    this.setData({
    //      animationNextPage: animationBottom1,
    //      word:"选对了"
    //    })

    //   // 选对了的旁边提示栏部分的结束
    //   } else {
    //       // 选错了

    //       word.power += word.power < 3 ? 1 : 0;//权上限为3
    //       //加入错题本
    //       let mistaken = user_info.word_tag.mistaken;
    //       mistaken.insert(mistaken.length, { field: user_info.data.level, wordId: word._id });
    //       console.log(false);
    //       tmp[my_option] = 'answer-hover-false';
    //       this.setData({
    //           correct: false,
    //           selected: true,
    //           hover_class: tmp
    //       });
    //   // 选错了的跳动样式的开始
    //        var animation2 = wx.createAnimation({
    //           duration:50,
    //           timingFunction:'linear'
    //         })
    //           animation2.translateX(-10).step(1);
    //           animation2.translateX(0).step(2);
    //           animation2.translateX(10).step(3);
    //           animation2.translateX(0).step(4);
    //           if(my_option == 0) {
    //             this.setData({
    //               animationWrongData0: animation2
    //             })
    //           }
    //           else if(my_option == 1) {
    //             this.setData({
    //               animationWrongData1: animation2
    //             })
    //           }
    //           else if (my_option == 2) {
    //             this.setData({
    //               animationWrongData2: animation2
    //             })
    //           }
    //           else if (my_option == 3) {
    //             this.setData({
    //               animationWrongData3: animation2
    //             })
    //           }
    //   // 选错了的跳动样式的结束

    //   // 选错了的提示部分的开始
    //     var animationBottom2 = wx.createAnimation({
    //       duration: 20,
    //       timingFunction: 'linear'
    //     })

    //       animationBottom2.translateY(-60).step(1),
    //       animationBottom2.translateY(5).step(2),
    //       this.setData({
    //         animationNextPage: animationBottom2,
    //         word: "选错了"
    //       })


    //   // 选错了的提示部分的结束


    //   }
    //   // 重新把animation清空
    //  this.setData({
    //   animationNextPage: {},
    //   animationData3:{},
    //   animationData2:{},
    //   animationData1:{},
    //   animationData0:{},
    //   animationWrongData0:{},
    //   animationWrongData1:{},
    //   animationWrongData2:{},
    //   animationWrongData3:{},
    //  })
    //}//更新缓存
    // wechat.setStorage("word_list", word_list).then(res => {
    //     return wechat.setStorage("user_info", user_info);
    // }, err => { })
  },



  showDetailsHandle: function (event) {

    // console.log("showDetailesHandle");
    let that = this;
    wx.setStorage({
      key: "gamePage",
      data: {
        problem: problem,
        options: options
      },
      success: function () {
        wx.navigateTo({
          url: 'wordDetails/wordDetails?item=' + event.currentTarget.dataset.id
        });
      }
    })

  },
  resetHandle: function () {
    resetPage(this);
  },
  backToMenuHandle: function () {

  }
});

// let sha = require('../../utils/HASH_SHA1');





//演示代码
//console.log(sha);


// wx.cloud.callFunction({
//     name: "getOpenId",
//     success: function (res) {
//         console.log("openid: ", res.result.openId);
//         var sec = sha.SHA1(res.result.openId);
//         console.log("openid sha1加密结果: ", sec);
//     }
// })

// let User = require('../../utils/User');

// console.log(User);


// 测试代码
// wx.setStorage({
//     key: "user_info",
//     data: {
//         basic: { nickname: "2 0 1 2", avaterUrl: "#", openId: "155a72dc45b86fc324b9649a89b59d717164fc7f" },
//         data: { level: 0, exp: 12, items: [0, 0, 0, 0, 1] },
//         update_time: {},
//         word_tag: {
//             completed: [{ field: 0, wordId: "" }],
//             mistaken: [{ field: 0, wordId: "" }],
//             collected: [{ field: 0, wordId: "" }]
//         }
//     }
// })

wx.setStorage({
  key: "word_list",
  data: [
    { "_id": "cloud-word-apple", "power": 1.0, "last_view_time": 3600.0, "en": "apple", "ch": "n.苹果;", "audio": "audioSrc", "image": "imageSrc" },
    { "_id": "cloud-word-banana", "power": 2.0, "last_view_time": 3600.0, "en": "banana", "ch": "n.香蕉;", "audio": "audioSrc", "image": "imageSrc" },
    { "_id": "cloud-word-carambola", "power": 2.0, "last_view_time": 3600.0, "en": "carambola", "ch": "n.杨桃;", "audio": "audioSrc", "image": "imageSrc" },
    { "_id": "cloud-word-durian", "power": 2.0, "last_view_time": 3600.0, "en": "durian", "ch": "n.榴莲;", "audio": "audioSrc", "image": "imageSrc" },
    { "_id": "cloud-word-grape", "power": 2.0, "last_view_time": 3600.0, "en": "grape", "ch": "n.葡萄;", "audio": "audioSrc", "image": "imageSrc" },
    { "_id": "cloud-word-mango", "power": 2.0, "last_view_time": 3600.0, "en": "mango", "ch": "n.芒果;", "audio": "audioSrc", "image": "imageSrc" },
    { "_id": "cloud-word-mangosteen", "power": 2.0, "last_view_time": 3600.0, "en": "mangosteen", "ch": "n.山竹;", "audio": "audioSrc", "image": "imageSrc" },
    { "_id": "cloud-word-orange", "power": 2.0, "last_view_time": 3600.0, "en": "orange", "ch": "n.橙子;", "audio": "audioSrc", "image": "imageSrc" },
    { "_id": "cloud-word-pear", "power": 2.0, "last_view_time": 3600.0, "en": "pear", "ch": "n.梨;", "audio": "audioSrc", "image": "imageSrc" },
    { "_id": "cloud-word-pineapple", "power": 2.0, "last_view_time": 3600.0, "en": "pineapple", "ch": "n.菠萝;", "audio": "audioSrc", "image": "imageSrc" },
    { "_id": "cloud-word-pitaya", "power": 2.0, "last_view_time": 3600.0, "en": "pitaya", "ch": "n.火龙果;", "audio": "audioSrc", "image": "imageSrc" },
    { "_id": "cloud-word-strawberry", "power": 2.0, "last_view_time": 3600.0, "en": "strawberry", "ch": "n.草莓;", "audio": "audioSrc", "image": "imageSrc" },
    { "_id": "cloud-word-watermelon", "power": 2.0, "last_view_time": 3600.0, "en": "watermelon", "ch": "n.西瓜;", "audio": "audioSrc", "image": "imageSrc" }
  ]
})

function allDifferent(item, array) {
  for (let i = 0; i < array.length; i++) {
    if (item == array[i])
      return false;
  }
  return true;
}

// function asyncInit() {
//     wechat.getStorage("word_list").then(res => {
//         var word_list = res.data;
//         // console.log(word_list);
//         if (word_list.length < 4) {//缓存中单词数量不足
//             return wechat.callFunction("pull", { key: "word_list" }).then(res => {//云调用数据库更新
//                 //console.log(res.result.data);
//                 word_list = res.result.data;//DEBUG ONLY
//                 return wechat.setStorage("word_list", word_list);//同时写入缓存
//             }, err => { console.log("!callFunction:pull, ERROR: ", err) });
//         }
//     }, err => { console.log("!getStorage:word_list, ERROR: ", err) }).then(empty => {
//         word_list = word_list;//同步至全局对象word
//         console.log(this);
//     });
// }

function resetPage(this_pointer) {
  var temp = {};
  for (let i = 0; i < 30; i++) {

    //获取随机数下标,保证随机数范围在[0, word_list.length)内
    var random_index = Math.floor(Math.random() * word_list.length);
    //console.log(random);
    temp = word_list[random_index];
    //优先挑选10分钟内未遇到过的,且已经错过一次以上的单词
    if (temp.last_view_time >= 10 * 60 && temp.power >= 3) {
      break;
    }
  }
  listId = random_index;
  problem = temp;//全局同步

  //更新选项
  temp = [];
  let right = word_list[listId];
  if (word_list.length < 4) {
    //更新单词
  }
  //已选中
  let got = [];
  //随机挑选选项
  for (let i = 0; i < 3;) {
    random_index = Math.floor(Math.random() * word_list.length);
    if (random_index != listId && allDifferent(random_index, got)) {//不冲突
      //temp[i++]=word_list[randomIndex];
      temp[i] = (word_list[random_index]);
      got[i] = random_index;
      //console.log(last);
      i++;
      //console.log(randomIndex);
    }
  }
  //随机插入正确答案
  let random = Math.random();

  if (random >= 0 && random < 0.25) {
    temp.insert(0, right);
    true_option = 0;
  } else if (random >= 0.25 && random < 0.5) {
    temp.insert(1, right);
    true_option = 1;
  } else if (random >= 0.5 && random < 0.75) {
    temp.insert(2, right);
    true_option = 2;
  } else {
    temp.insert(3, right);
    true_option = 3;
  }
  //console.log(temp);
  options = temp;//全局同步
  //页面同步
  this_pointer.setData({
    problem: problem,
    options: options,
    selected: false,//刷新状态
    correct: false,
    hover_class: ['', '', '', '']
  });
}


//抽取碎片
function drawItem() {
  var tmp = [];
  for (var i = 0; ; i++) {

  }
  var randomIndex = random(0, item.length);
  return item[randomIndex];
}