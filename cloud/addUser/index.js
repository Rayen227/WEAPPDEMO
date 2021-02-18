// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    return await cloud.database().collection('users').add({
        data: event.user_info,
        success: console.log, fail: console.error
    });
}