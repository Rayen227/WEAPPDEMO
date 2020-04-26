var wechat = require('../../utils/promise.js');

var Word = {
    secret: {
        allDifferent: function (item, array) {
            for (let i = 0; i < array.length; i++) {
                if (item == array[i])
                    return false;
            }
            return true;
        }

    },
    list: [],
    true_option: 0,
    my_option: 0,
    page: {
        problem: {},
        options: [],
        click: 0,//用于在showDetails页面获取需要展示的单词
        hover_class: ['', '', '', ''],
        selected: false,
        correct: false
    },
    asyncInit: function () {
        // wechat.getStorage("word_list").then(res => {
        //     var word_list = res.data;
        //     // console.log(word_list);
        //     if (word_list.length < 4) {//缓存中单词数量不足
        //         return wechat.callFunction("pull", { key: "word_list" }).then(res => {//云调用数据库更新
        //             //console.log(res.result.data);
        //             word_list = res.result.data;//DEBUG ONLY
        //             return wechat.setStorage("word_list", word_list);//同时写入缓存
        //         }, err => { console.log("!callFunction:pull, ERROR: ", err) });
        //     }
        // }, err => { console.log("!getStorage:word_list, ERROR: ", err) }).then(empty => {
        //     this.list = word_list;//同步至全局对象word
        //     console.log(this);
        // });

        wx.getStorage({
            key: 'word_list',
            success: function (res) {
                var word_list = res.data;
                //if
                this.list = word_list;
            }
        });
    },
    resetPage: function (this_pointer) {
        console.log(this);
        var temp = {};
        for (let i = 0; i < 30; i++) {

            //获取随机数下标,保证随机数范围在[0, list.length)内
            let random_index = Math.floor(Math.random() * this.list.length);
            //console.log(random);
            temp = this.list[random_index];
            //优先挑选10分钟内未遇到过的,且已经错过一次以上的单词
            if (temp.last_view_time >= 10 * 60 && temp.power >= 3) {
                break;
            }
        }
        wordIndex = random_index;
        this.page.problem = temp;

        //更新选项
        temp = [];
        let right = this.list[word_index];
        if (this.list.length < 4) {
            Update();
        }
        //已选中
        let got = [];
        //随机挑选选项
        for (let i = 0; i < 3;) {
            let random_index = Math.floor(Math.random() * this.list.length);
            if (random_index != word_index && this.secret.allDifferent(random_index, got)) {//不冲突
                //temp[i++]=list[randomIndex];
                temp[i] = (this.list[random_index]);
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
        this.page.options = temp;
        //同步页面
        this_pointer.setData({
            problem: this.page.problem,
            options: this.page.options,
            hover_class: this.page.hover_class,
            selected: this.page.selected,
            correct: this.page.correct
        });

    }
}

module.exports = Word;