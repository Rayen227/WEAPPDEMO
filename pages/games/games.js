let wechat = require('../../utils/promise.js');
let time = require('../../utils/time.js');

var level = 0;
var isRelaxed = false;
var user_info = {};
var word_list = [];
var word_set = [];
var listId = 0;//正确的单词处在word_list的下标
var true_option = 0;
var my_option = 0;
var count = 0;
var combo = 0;
var problem = {};
var options = [];
var letters = [];
var startPoint = 0;
var oldTop = [769, 731, 689, 639, 803, 813, 621, 556, 885, 907, 674, 497, 900, 700, 992, 579, 1004, 508, 982, 500];
var oldLeft = [321, 198, 420, 294, 470, 90, 152, 571, 349, 556, 51, 332, 200, 591, 100, 440, 300, 47, 480, 200];
var answer = [];
var visible = [];
var words = [];
var audio = [];

Page({
    data: {
        problem: {},
        options: [],
        animation: [],
        nextPageAnimation: {},
        hover_class: ['', '', '', ''],
        selected: false,
        correct: false,
        tips: "",
        letter: [],
        src: '',
        maxLength: 0,
        answer: [],
        visible: [],
        joint: false,
        words: [],
        lefts: 0,
    },

    onLoad: function (e) {
        wx.cloud.getTempFileURL({
            fileList: ['cloud://elay-t6atq.656c-elay-t6atq-1302369471/audio/correct.mp3', 'cloud://elay-t6atq.656c-elay-t6atq-1302369471/audio/false.mp3'],
            success: res => {
                audio[0] = wx.createInnerAudioContext();
                audio[1] = wx.createInnerAudioContext();
                audio[0].src = res.fileList[0].tempFileURL;
                audio[0].onError(err => {
                    console.log(err);
                });
                audio[1].src = res.fileList[1].tempFileURL;
                audio[1].onError(err => {
                    console.log(err);
                });
            },
            fail: console.error
        });

        level = e.level;
        var that = this;
        wx.showLoading({
            title: 'Loading',
            duration: 500
        });
        wechat.getStorage("STDWordset").then(res => {
            word_set = res.data;
            return wechat.getStorage("user_info");
        }, err => { }).then(res => {
            user_info = res.data;
            isRelaxed = level != user_info.data.level;
            word_list = isRelaxed ? word_set[level].words : user_info.unpassed;
        }).then(res => {
            if (!isRelaxed) {
                that.data.lefts = user_info.unpassed.length;
            }
            resetPage(that);
        }, err => { });

    },

    onUploud: function () {
        updateCloud();
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
        console.log(word);
        var classTmp = ['', '', '', ''];
        if (my_option == true_option) {//选对啦
            audio[0].stop();
            audio[0].play();
            count++;
            combo++;
            word.power--;
            word.last_view_time = time.getTime().timestamp;
            if (count > 15 && combo > 10) {
                drawItem();
                count = 0;
            }
            user_info.data.exp++;
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
            });

            if (word.power <= 0) {
                user_info.unpassed.remove(listId);
                that.setData({ lefts: user_info.unpassed.length });
                wechat.setStorage("user_info", user_info);
                if (user_info.unpassed.length <= 0) {//通关
                    user_info.data.level++;//等级增加
                    wechat.setStorage("user_info", user_info).then(res => {
                        return wechat.getStorage("STDWordset");
                    }, err => { }).then(res => {
                        word_list = res.data[level].words;
                        user_info.unpassed = [];
                        for (var i = 0; i < word_list.length; i++) {
                            user_info.unpassed.add(i);
                        }
                        return wechat.setStorage("user_info", user_info);
                    }, err => { }).then(res => {
                        wx.showModal({
                            title: '恭喜！',
                            content: "你通关了！",
                            showCancel: false,
                            confirmColor: '#3CC51F',
                            confirmText: "确定",
                            complete: function () {
                                wx.navigateTo({
                                    url: '../checkLevel/checkLevel'
                                });
                            }
                        });
                    }, err => { });
                }
            }
            classTmp[my_option] = 'answer-hover-true';
            that.setData({
                correct: true,
                selected: true,
                hover_class: classTmp
            });
        }
        else {
            // 选错了
            audio[1].stop();
            audio[1].play();
            combo = 0;
            // word.power += word.power < 3 ? 1 : 0;//权上限为2
            //加入错题本
            let mistaken = user_info.word_tag.mistaken;
            var tmp = [];
            for (var i = 0; i < mistaken.length; i++) {
                tmp.add(mistaken[i].en);
            }
            if (!tmp.includes(word.en)) {
                mistaken.add(word);
            }
            user_info.word_tag.mistaken = mistaken;
            classTmp[my_option] = 'answer-hover-false';
            classTmp[true_option] = 'answer-hover-true';
            this.setData({
                correct: false,
                selected: true,
                hover_class: classTmp
            });
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
        }
        this.setData({
            animation: []
        });
        wechat.setStorage("user_info", user_info);
        updateCloud();
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

    showDetailsHandle: function (e) {
        let that = this;
        wx.setStorage({
            key: "gamePage",
            data: {
                problem: problem,
                options: options
            },
            success: function () {
                wechat.setStorage("currentWord", options[e.currentTarget.dataset.id]).then(res => {
                    wx.navigateTo({
                        url: '../wordDetails/wordDetails'
                    });
                }, err => { });

            }
        });

    },

    resetHandle: function () {
        // if (random(0, 10) >= 1) {
        if (true) {
            resetPage(this);
            this.setData({
                gameType: 1
            });
        }
        else {
            wx.showLoading({
                title: 'Loading',
                duration: 500
            });
            answer = [];
            visible.memset(20, true);
            this.setData({
                answer: answer,
                visible: visible
            });
            var maxLength = getLeters(2);
            var tmpLeft = [];
            var tmpTop = [];
            for (var i = 0; i < letters.length; i++) {
                tmpLeft[i] = oldLeft[i];
                tmpTop[i] = oldTop[i];
            }
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
        }
    },


});

function resetPage(this_pointer) {

    listId = getWord();
    problem = word_list[listId];
    //更新选项
    // var temp = [];
    let right = word_list[listId];
    //已选中
    let got = [];
    var random_list_index;
    var random_index;
    var tmp_word;
    var cnt = 0;
    var isNotIncludes;
    //随机挑选选项
    for (let i = 0; i < 3; cnt++) {
        random_list_index = user_info.data.level == 0 ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * user_info.data.level);
        random_index = Math.floor(Math.random() * word_set[random_list_index].left);
        tmp_word = word_set[random_list_index].words[random_index];
        isNotIncludes = true;
        for (var j = 0; j < got.length; j++) {
            if (got[j].en == tmp_word.en)
                isNotIncludes = false;
        }
        if (isNotIncludes) {
            got.add(tmp_word);
            i++;
        }
    }
    //随机插入正确答案
    let random = Math.random();
    if (random >= 0 && random < 0.25) {
        got.insert(0, right);
        true_option = 0;
    } else if (random >= 0.25 && random < 0.5) {
        got.insert(1, right);
        true_option = 1;
    } else if (random >= 0.5 && random < 0.75) {
        got.insert(2, right);
        true_option = 2;
    } else {
        got.insert(3, right);
        true_option = 3;
    }
    options = got;//全局同步
    //页面同步
    this_pointer.setData({
        problem: problem,
        options: options,
        selected: false,//刷新状态
        correct: false,
        hover_class: ['', '', '', ''],
        lefts: isRelaxed ? 0 : user_info.unpassed.length
    });
}

//抽取碎片
function drawItem() {
    var that = this;
    var itemCount = 18;
    var items = user_info.data.items;
    if (items.length == itemCount) {
        return false;
    }
    var index = random(0, items.length - items.length);
    for (var i = 0; i < itemCount; i++) {
        if (items.includes(i)) continue;
        if (index-- == 0) {
            user_info.data.items.add(i);
            wechat.setStorage("user_info", user_info).then(res => { return; }, err => { });
        }
    }
    console.log("?REEOE: FUNCTION drawItem()!");
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

//返回单词word_list对应下标
function getWord() {
    if (!isRelaxed) {//闯关模式
        var random_index = Math.floor(Math.random() * user_info.unpassed.length);
        return random_index;
    } else {//休闲模式
        var random_index = Math.floor(Math.random() * word_list.length);
        return random_index;
    }
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
    // var len = string.replace(/[^\u0000-\u00ff]/g, "aa").length;
    var tmp1 = string.indexOf('，');
    var tmp2 = string.indexOf('；');
    var index = -1;
    if (tmp1 != -1 && tmp2 == -1 || tmp1 != -1 && tmp2 != -1 && tmp1 < tmp2) index = tmp1;
    else index = tmp2;
    return index != -1 ? string.intercept(0, index) : string;
}

function updateCloud() {
    user_info.update_time = time.getTime();
    wechat.callFunction("updateUser", {
        _openid: user_info._openid,
        data: {
            data: user_info.data,
            update_time: user_info.update_time,
            word_tag: user_info.word_tag,
            unpassed: user_info.unpassed
        }
    });
}