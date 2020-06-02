let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');
let item_list = require('../../utils/items.js');

var user_info = {};
var word_list = [];
var listId = 0;
var true_option = 0;
var my_option = 0;
var count = 0;
var problem = {};
var options = [];
var letters = [];
var startPoint = 0;
var oldTop = [769, 731, 689, 639, 803, 813, 621, 556, 885, 907, 674, 497, 900, 700, 992, 579, 1004, 508, 982, 500];
var oldLeft = [321, 198, 420, 294, 470, 90, 152, 571, 349, 556, 51, 332, 200, 591, 100, 440, 300, 47, 480, 200];
var answer = [];
var visible = [];
var words = [];

Page({
    data: {
        gameType: 1,
        problem: {},
        options: [],
        animation: [],
        nextPageAnimation: {},
        hover_class: ['', '', '', ''],
        selected: false,
        correct: false,
        tips: "",
        problemTop: [100, 121, 150, 185, 187, 214, 170, 159, 177, 198],
        problemLeft: [0, 70, 148, 233, 304, 379, 440, 514, 594, 672],
        curTop: [769, 731, 689, 639, 803, 813, 621, 556, 885, 907, 674, 497, 900, 700, 992, 579, 1004, 508, 982, 500],
        curLeft: [321, 198, 420, 294, 470, 90, 152, 571, 349, 556, 51, 332, 200, 591, 100, 440, 300, 47, 480, 200],
        letter: [],
        src: '',
        maxLength: 0,
        audioSrc: [],
        answer: [],
        visible: [],
        joint: false,
        words: []
    },

    moveStart: function (e) {
        startPoint = e.touches[0];
    },

    moving: function (e) {
        var index = e.currentTarget.dataset.index;
        var endPoint = e.touches[e.touches.length - 1];
        var prop = getRpx();//获取rpx转化比例
        var translateX = endPoint.clientX - startPoint.clientX;
        var translateY = endPoint.clientY - startPoint.clientY;
        startPoint = endPoint;
        var curTop = this.data.curTop[index] + translateY * prop;
        var curLeft = this.data.curLeft[index] + translateX * prop;
        var tmpTop = this.data.curTop;
        tmpTop[index] = curTop;
        var tmpLeft = this.data.curLeft;
        tmpLeft[index] = curLeft;
        this.setData({
            curTop: tmpTop,
            curLeft: tmpLeft
        });
    },

    moveEnd: function (e) {//最终定位
        var that = this;
        var index = e.currentTarget.dataset.index;
        var right = answer.length;
        if (right < this.data.maxLength) {
            answer[right] = letters[index];
        }
        visible[index] = false;
        // console.log(answer);
        this.setData({
            answer: answer,
            visible: visible,
            joint: true
        });

    },

    onLoad: function () {
        var that = this;
        var needUpdate = false;
        wx.showToast({
            icon: 'loading',
            duration: 500
        });
        wechat.getStorage("user_info").then(res => {
            user_info = res.data;
            return wechat.getStorage("word_list");
        }, err => { }).then(res => {
            word_list = res.data;
            if (word_list.length < 4) {//缓存中单词数量不足
                console.log("缓存单词不足");
                needUpdate = true;
                wx.showToast({
                    icon: 'loading',
                    duration: 1000
                });
                return wechat.callFunction("getWordDB", { level: user_info.data.level });
            }
        }, err => {
            needUpdate = true;
            console.log("单词缓存读取错误")
            return wechat.callFunction("getWordDB", { level: user_info.data.level });
        }
        ).then(res => {
            // console.log(needUpdate);
            if (needUpdate) {
                console.log(res);
                var tmp = word_list;
                word_list = res.result.data.words;
                word_list = word_list.concat(tmp);
                console.log("缓存单词更新成功");
                user_info.data.level++;
                return wechat.setStorage("word_list", word_list);//同时写入缓存
            }
        }, err => { console.log(err); }).then(res => {
            //word_list中单词中文重构
            for (var i = 0; i < word_list.length; i++) {
                word_list[i].ch = getCh(word_list[i].ch)
            }
            resetPage(that);
        }, err => { }).then(empty => {
            var audio = [];
            wx.cloud.getTempFileURL({
                fileList: ["cloud://elay-pvyjb.656c-elay-pvyjb-1301343918/audio/correct.mp3"],
                success: res => {
                    audio[0] = res.fileList[0].tempFileURL;
                    wx.cloud.getTempFileURL({
                        fileList: ["cloud://elay-pvyjb.656c-elay-pvyjb-1301343918/audio/false.mp3"],
                        success: res => {
                            audio[1] = res.fileList[0].tempFileURL;
                            that.setData({
                                audioSrc: audio
                            });
                        },
                        fail: console.error
                    });
                },
                fail: console.error
            });
            wx.setStorage({
                key: "user_info",
                data: user_info
            });
        });

    },

    selectHandle: function (event) {
        var that = this;
        var animation = wx.createAnimation({
            duration: 100,
            timingFunction: 'linear'
        });
        animation.translateY(-20).step(1);
        animation.translateY(0).step(2);
        my_option = event.currentTarget.dataset.id;
        let word = word_list[listId];
        var tmp = ['', '', '', ''];
        if (my_option == true_option) {//选对啦
            wx.createAudioContext("trueAudio").play();
            if (my_option == 0) {
                that.setData({
                    animation: [animation, null, null, null]
                })
            }
            else if (my_option == 1) {
                that.setData({
                    animation: [null, animation, null, null]
                })
            }
            else if (my_option == 2) {
                that.setData({
                    animation: [null, null, animation, null]
                })
            }
            else if (my_option == 3) {
                that.setData({
                    animation: [null, null, null, animation]
                })
            }
            var nextPageAnimation = wx.createAnimation({
                duration: 20,
                timingFunction: 'linear'
            })
            nextPageAnimation.translateY(-60).step(1);
            nextPageAnimation.translateY(5).step(2);
            that.setData({
                nextPageAnimation: nextPageAnimation,
                word: "选对了"
            })
            word.power--;
            count += Math.floor(Math.random() * 2);
            if (count >= 10) {
                var item = drawItem();
            }
            word.last_view_time = time.getTime().timestamp;
            if (word.power <= 0) {//权小于零则移除缓存记录
                word_list.remove(listId);
                //判断是否更新缓存
                if (word_list.length < 4) {
                    wx.showToast({
                        icon: 'loading',
                        duration: 1000
                    });
                    wechat.callFunction("getWordDB", { level: user_info.data.level }).then(res => {
                        var tmp = word_list;
                        word_list = res.result.data.words;
                        word_list = word_list.concat(tmp);
                        user_info.data.level++;
                        return wechat.setStorage("word_list", word_list);
                    }, err => { });
                }
            }
            tmp[my_option] = 'answer-hover-true';
            that.setData({
                correct: true,
                selected: true,
                hover_class: tmp
            });
        }
        else {
            // 选错了
            wx.createAudioContext("falseAudio").play();
            word.power += word.power < 3 ? 1 : 0;//权上限为3
            //加入错题本
            let mistaken = user_info.word_tag.mistaken;
            mistaken.insert(mistaken.length, word);
            console.log(false);
            tmp[my_option] = 'answer-hover-false';
            this.setData({
                correct: false,
                selected: true,
                hover_class: tmp
            });
            // 选错了的跳动样式的开始
            var animation2 = wx.createAnimation({
                duration: 100,
                timingFunction: 'linear'
            })
            animation2.scale(1.1, 1.1).step(1);
            animation2.scale(1, 1).step(2);
            if (my_option == 0) {
                this.setData({
                    animation: [animation2, null, null, null]
                })
            }
            else if (my_option == 1) {
                this.setData({
                    animation: [null, animation2, null, null]
                })
            }
            else if (my_option == 2) {
                this.setData({
                    animation: [null, null, animation2, null]
                })
            }
            else if (my_option == 3) {
                this.setData({
                    animation: [null, null, null, animation2]
                })
            }
            // 选错了的跳动样式的结束

            // 选错了的提示部分的开始
            var nextPageAnimation = wx.createAnimation({
                duration: 20,
                timingFunction: 'linear'
            })

            nextPageAnimation.translateY(-60).step(1),
                nextPageAnimation.translateY(5).step(2),
                this.setData({
                    nextPageAnimation: nextPageAnimation,
                    word: "选错了"
                });
            // 选错了的提示部分的结束
        }
        // 重新把animation清空
        this.setData({
            animation: []
        });
        wechat.setStorage("word_list", word_list).then(res => {
            return wechat.setStorage("user_info", user_info);
        }, err => { });
    },

    containerTap: function (res) {
        var that = this
        var x = res.touches[0].pageX;
        var y = res.touches[0].pageY + 85;
        this.setData({
            rippleStyle: ''
        });
        setTimeout(function () {
            that.setData({
                rippleStyle: 'top:' + y + 'px;left:' + x + 'px;-webkit-animation: ripple 0.4s linear;animation:ripple 0.4s linear;'
            });
        }, 200)
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
                    url: 'wordDetails/wordDetails?item=' + event.currentTarget.dataset.id + '&flag=0'
                });
            }
        });

    },

    resetHandle: function () {
        if (random(0, 6) >= 1) {
            resetPage(this);
            this.setData({
                gameType: 1
            });
        }
        else {
            wx.showToast({
                icon: 'loading',
                duration: 500
            });
            answer = [];
            visible.memset(20, true);
            // console.log(answer, visible);
            this.setData({
                answer: answer,
                visible: visible
            });
            var maxLength = getLeters(2);//获取单词
            // console.log(maxLength);
            //定位
            var tmpLeft = [];
            var tmpTop = [];
            for (var i = 0; i < letters.length; i++) {
                tmpLeft[i] = oldLeft[i];
                tmpTop[i] = oldTop[i];
            }
            // var startPoint = positionList[maxLength];
            // console.log(maxLength);
            var tmp = [];
            for (var i = 0; i < words.length; i++) {
                if (!tmp.includes(words[i].en)) {
                    tmp[i] = words[i].en;
                }
            }
            this.setData({
                letter: letters,
                curLeft: tmpLeft,
                curTop: tmpTop,
                gameType: 0,
                maxLength: maxLength,
                joint: false,
                words: tmp
            });
            // console.log("coji!", words);
        }
        // resetPage(this);
    },

    backToMenuHandle: function () {

    },

    resetLetters: function () {
        answer = [];
        visible.memset(20, true);
        // this.data.curLeft = oldLeft;
        // this.data.curTop = oldTop;
        this.setData({
            answer: answer,
            visible: visible,
            curLeft: [321, 198, 420, 294, 470, 90, 152, 571, 349, 556, 51, 332, 200, 591, 100, 440, 300, 47, 480, 200],
            curTop: [769, 731, 689, 639, 803, 813, 621, 556, 885, 907, 674, 497, 900, 700, 992, 579, 1004, 508, 982, 500]
        });
    },

    confirmLetters: function () {
        var that = this;
        if (isAWord(answer)) {
            wx.showModal({
                title: '你成功了~',
                content: "你拼出的是" + "'" + words[0].en + "'" + "\n刚才的字母还可以拼成" + "'" + words[1].en + "'~",
                showCancel: true,
                cancelText: '下一题',
                cancelColor: '#3CC51F',
                confirmText: '查看单词',
                confirmColor: '#000000',
                success: (result) => {
                    if (!result.confirm) {
                        that.resetHandle();
                    } else {
                        wx.showActionSheet({
                            itemList: [words[0].en, words[1].en],
                            success: function (res) {
                                if (res.tapIndex == 2) {
                                    that.resetHandle()
                                } else {
                                    wx.navigateTo({
                                        url: 'wordDetails/wordDetails?en=' + words[res.tapIndex].en + '&ch=' + words[res.tapIndex].ch + '&accent=' + words[res.tapIndex].accent + '&mp3=' + words[res.tapIndex].mp3 + '&jpg=' + words[res.tapIndex].jpg + '&sentenceEn=' + words[res.tapIndex].sentenceEn + '&sentenceCh=' + words[res.tapIndex].sententCh + '&power=' + words[res.tapIndex].power + '&last_view_time=' + words[res.tapIndex].last_view_time
                                    });
                                }
                            },
                            fail: function (res) {
                                that.resetHandle();
                            }

                        });
                    }
                },
                fail: () => { },
                complete: () => { }
            });
        } else {
            wx.showModal({
                title: '你失败了...',
                content: "正确的单词是" + "'" + words[0].en + "'" + " 或者 " + "'" + words[1].en + "'~",
                showCancel: true,
                cancelText: '下一题',
                cancelColor: '#3CC51F',
                confirmText: '查看单词',
                confirmColor: '#000000',
                success: (result) => {
                    if (!result.confirm) {
                        that.resetHandle();
                    } else {
                        wx.showActionSheet({
                            itemList: [words[0].en, words[1].en],
                            success: function (res) {
                                if (res.tapIndex == 2) {
                                    that.resetHandle()
                                } else {
                                    wx.navigateTo({
                                        url: 'wordDetails/wordDetails?en=' + words[res.tapIndex].en + '&ch=' + words[res.tapIndex].ch + '&accent=' + words[res.tapIndex].accent + '&mp3=' + words[res.tapIndex].mp3 + '&jpg=' + words[res.tapIndex].jpg + '&sentenceEn=' + words[res.tapIndex].sentenceEn + '&sentenceCh=' + words[res.tapIndex].sententCh
                                    });
                                }
                            },
                            fail: function (res) {
                                that.resetHandle();
                            }

                        });
                    }
                },
                fail: () => { },
                complete: () => { }
            });
        }
    }
});

function allDifferent(item, array) {
    for (let i = 0; i < array.length; i++) {
        if (item == array[i])
            return false;
    }
    return true;
}

function resetPage(this_pointer) {
    // console.log(word_list);
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
    var that = this;
    wechat.callFunction("getItems").then(res => {
        // console.log(res.result.data);
        var items = res.result.data;
        var item = items[random(0, items.length)];
        // console.log(item);
        user_info.data.item.add(item);
        return setStorage("user_info", user_info);
    });
}

function getLeters(n) {
    words = [];
    var tmp = {};
    var maxLength = 0;
    for (var i = 0; i < n;) {
        tmp = getWord();
        if (tmp && !words.includes(tmp)) {
            words[i++] = tmp;
        }
    }
    for (var i = 0; i < words.length; i++) {
        if ((words[i].en).length > maxLength) {
            maxLength = (words[i].en).length;
        }
    }
    letters = split([words[0].en, words[1].en]);
    console.log(words[0].en, words[1].en);
    // console.log(words);
    // console.log(words);
    return maxLength;
}

function split(words) {
    var tmp = [];
    var k = 0;
    for (var i = 0; i < words.length; i++) {
        for (var j = 0; j < words[i].length; j++) {
            if (words[i][j]) {
                tmp[k++] = words[i][j];
            }
        }
    }
    return randomUpset(tmp);
}

function getWord() {
    var random_index = Math.floor(Math.random() * word_list.length)
    return word_list[random_index];
}
//随机打乱数组顺序
function randomUpset(arr) {
    var len = arr.length
    for (var i = len - 1; i >= 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var itemIndex = arr[randomIndex];
        arr[randomIndex] = arr[i];
        arr[i] = itemIndex;
    }
    return arr;
}

function getRpx() {
    var winWidth = wx.getSystemInfoSync().windowWidth;
    return 750 / winWidth;
}

function isAWord(letters) {
    // console.log(letters.join(''), words);
    for (var i = 0; i < words.length; i++) {
        if (letters.join('') == words[i].en) {
            return true;
        }
    }
    return false;
}

function random(lower, upper) {
    return Math.floor(Math.random() * (upper - lower)) + lower;
}

function getCh(string) {
    var index = string.indexOf('；');
    return index != -1 ? string.intercept(0, index) : string;
}


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

// wx.setStorage({
//   key: "word_list",
//   data: [
//     { "_id": "cloud-word-apple", "power": 1.0, "last_view_time": 3600.0, "en": "apple", "ch": "n.苹果;", "audio": "audioSrc", "image": "imageSrc" },
//     { "_id": "cloud-word-banana", "power": 2.0, "last_view_time": 3600.0, "en": "banana", "ch": "n.香蕉;", "audio": "audioSrc", "image": "imageSrc" },
//     { "_id": "cloud-word-carambola", "power": 2.0, "last_view_time": 3600.0, "en": "carambola", "ch": "n.杨桃;", "audio": "audioSrc", "image": "imageSrc" },
//     { "_id": "cloud-word-durian", "power": 2.0, "last_view_time": 3600.0, "en": "durian", "ch": "n.榴莲;", "audio": "audioSrc", "image": "imageSrc" },
//     { "_id": "cloud-word-grape", "power": 2.0, "last_view_time": 3600.0, "en": "grape", "ch": "n.葡萄;", "audio": "audioSrc", "image": "imageSrc" },
//     { "_id": "cloud-word-mango", "power": 2.0, "last_view_time": 3600.0, "en": "mango", "ch": "n.芒果;", "audio": "audioSrc", "image": "imageSrc" },
//     { "_id": "cloud-word-mangosteen", "power": 2.0, "last_view_time": 3600.0, "en": "mangosteen", "ch": "n.山竹;", "audio": "audioSrc", "image": "imageSrc" },
//     { "_id": "cloud-word-orange", "power": 2.0, "last_view_time": 3600.0, "en": "orange", "ch": "n.橙子;", "audio": "audioSrc", "image": "imageSrc" },
//     { "_id": "cloud-word-pear", "power": 2.0, "last_view_time": 3600.0, "en": "pear", "ch": "n.梨;", "audio": "audioSrc", "image": "imageSrc" },
//     { "_id": "cloud-word-pineapple", "power": 2.0, "last_view_time": 3600.0, "en": "pineapple", "ch": "n.菠萝;", "audio": "audioSrc", "image": "imageSrc" },
//     { "_id": "cloud-word-pitaya", "power": 2.0, "last_view_time": 3600.0, "en": "pitaya", "ch": "n.火龙果;", "audio": "audioSrc", "image": "imageSrc" },
//     { "_id": "cloud-word-strawberry", "power": 2.0, "last_view_time": 3600.0, "en": "strawberry", "ch": "n.草莓;", "audio": "audioSrc", "image": "imageSrc" },
//     { "_id": "cloud-word-watermelon", "power": 2.0, "last_view_time": 3600.0, "en": "watermelon", "ch": "n.西瓜;", "audio": "audioSrc", "image": "imageSrc" }
//   ]
// })


// wechat.callFunction("getWordDB", { level: 0 }).then(res => {
//     console.log(res.result.data);
// }, err => {
//     console.log("!!!");
// })
