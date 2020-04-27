// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.database().collection(event.key).where(event.where).get({
    success: console.log, fail: console.error
  });
}