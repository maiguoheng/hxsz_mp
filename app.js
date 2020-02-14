//app.js11111
import Touches from './utils/Touches.js'
var Bmob = require("utils/bmob.js");
var common = require("utils/common.js");
const __utils = require('utils/util')
Bmob.initialize("bb577a4e1d6449c7fc6e8568d647e82d","e132ce46151fd8e7a9fa6fa28bd7edb2");
App({
  version: 'v2.2.4', //版本号
  onLaunch: function () {
    var that = this;
    //调用系统API获取设备的信息
    wx.getSystemInfo({
      success: function (res) {
        var kScreenW = res.windowWidth / 375
        var kScreenH = res.windowHeight / 603
        wx.setStorageSync('kScreenW', kScreenW)
        wx.setStorageSync('kScreenH', kScreenH)
      }
    })
    //存是否集市授权状态
    if(!wx.getStorageSync('isPermissed')){
      wx.setStorageSync('isPermissed', false);
    }
    //存是否求购授权状态
    if (!wx.getStorageSync('isPermissed2')) {
      wx.setStorageSync('isPermissed2', false);
    }

    var auth = Bmob.Object.extend("auth");
    var query = new Bmob.Query(auth);
    query.get("b7YtAAAE", {
      success: function (result) {
       
        that.globalData.auth = result.get("tag");
        
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });
    // 在没有 open-type=getUserInfo 版本的兼容处理
  //   try {
  //     wx.showToast({
  //       title: '加载中...',
  //       mask: true,
  //       icon: 'loading'
  //     })
  //     var value = wx.getStorageSync('user_openid')
  //     if (value) {

  //       wx.showToast({
  //         title: '已经登录',
  //         icon: 'succes',
  //         duration: 1000,
  //         mask: true
  //       })

  //     } else {
  //       console.log('执行login1')
  //       // wx.login({
  //       //   success: function (res) {
  //       //     if (res.code) {
  //       //       console.log('执行login2', res);
  //       //     }
  //       //   }
  //       // });
  //       wx.login({
  //         success: function (res) {
  //           if (res.code) {

  //             Bmob.User.requestOpenId(res.code, {
  //               success: function (userData) {
  //                 wx.getUserInfo({
  //                   success: function (result) {
  //                     var userInfo = result.userInfo
  //                     var nickName = userInfo.nickName
  //                     var avatarUrl = userInfo.avatarUrl
  //                     var sex = userInfo.gender
  //                     Bmob.User.logIn(nickName, userData.openid, {
  //                       success: function (user) {

  //                         wx.setStorageSync('user_openid', user.get('userData').openid)
  //                         wx.setStorageSync('user_id', user.id)
  //                         wx.setStorageSync('my_nick', user.get("nickname"))
  //                         wx.setStorageSync('my_username', user.get("username"))
  //                         wx.setStorageSync('my_sex', user.get("sex"))
  //                         wx.setStorageSync('my_avatar', user.get("userPic"))

  //                         wx.showToast({
  //                           title: '成功',
  //                           icon: 'succes',
  //                           duration: 1000,
  //                           mask: true
  //                         })
  //                         console.log("登录成功");
  //                       },
  //                       error: function (user, error) {
  //                         if (error.code == '101') {
  //                           var user = new Bmob.User(); //开始注册用户
  //                           user.set('username', nickName);
  //                           user.set('password', userData.openid);
  //                           user.set("nickname", nickName);
  //                           user.set("userPic", avatarUrl);
  //                           user.set("userData", userData);
  //                           user.set('sex', sex);
  //                           user.set('feednum', 0);
  //                           user.signUp(null, {
  //                             success: function (result) {
  //                               wx.showToast({
  //                                 title: '注册成功',
  //                                 icon: 'succes',
  //                                 duration: 1000,
  //                                 mask: true
  //                               })
  //                               console.log('注册成功');
  //                               try { //将返回的3rd_session存储到缓存中
  //                                 wx.setStorageSync('user_openid', user.get('userData').openid)
  //                                 wx.setStorageSync('user_id', user.id)
  //                                 wx.setStorageSync('my_nick', user.get("nickname"))
  //                                 wx.setStorageSync('my_username', user.get("username"))
  //                                 wx.setStorageSync('my_sex', user.get("sex"))
  //                                 wx.setStorageSync('my_avatar', user.get("userPic"))

  //                               } catch (e) { }
  //                             },
  //                             error: function (userData, error) {
  //                               console.log("openid=" + userData);
  //                               console.log(error)
  //                             }
  //                           });

  //                         }
  //                       }
  //                     });
  //                   }
  //                 })
  //               },
  //               error: function (error) {
  //                 console.log("Error: " + error.code + " " + error.message);
  //               }
  //             });
  //           } else {
  //             wx.showToast({
  //               title: '登陆失败',
  //               icon: 'succes',
  //               duration: 1000,
  //               mask: true
  //             })
  //             console.log('获取用户登录态失败1！' + res.errMsg)
  //           }
  //           console
  //         },
  //         //接口调用结束的回调函数（调用成功、失败都会执行）
  //         complete: function (e) {
  //           // wx.showToast({
  //           //   title: '登陆失败',
  //           //   icon: 'succes',
  //           //   duration: 1000,
  //           //   mask: true
  //           // })

  //         }
  //       });
  //     }
  //   } catch (e) {
  //     wx.showToast({
  //       title: '登陆失败',
  //       icon: 'succes',
  //       duration: 1000,
  //       mask: true
  //     })
  //     console.log(e)
  //   }
  //   wx.checkSession({
  //     success: function () { },
  //     fail: function () {
  //       //登录态过期，重新登录
  //       wx.login()
  //     }
  //   })







  // },
  // getUserInfo: function (cb) {
  //   var that = this
  //   if (this.globalData.userInfo) {
  //     typeof cb == 'function' && cb(this.globalData.userInfo)
  //   } else {
  //     //调用登录接口 
  //     wx.login({
  //       success: function () {
  //         wx.getUserInfo({
  //           success: function (res) {
  //             that.globalData.userInfo = res.userInfo
  //             typeof cb == 'function' && cb(that.globalData.userInfo)
  //           }
  //         })
  //       }
  //     })
  //   }


  
  
  },
  globalData: {
    userInfo: null,
    auth:0
  },
  onPullDownRefresh: function () {
    //wx.stopPullDownRefresh()
  },
  onError: function (msg) {
  },
  Touches: new Touches(),
  util: __utils,
})