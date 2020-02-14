// pages/suggestion/suggestion.js
var Bmob = require("../../utils/bmob.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  formSubmit: function (e) {
    var that = this
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (e.detail.value.contact && e.detail.value.content) {


      var Diary = Bmob.Object.extend("suggestion");
      var diary = new Diary();
      diary.set("content", e.detail.value.content);
      diary.set("contact", e.detail.value.contact);
      //添加数据，第一个入口参数是null
      diary.save(null, {
        success: function (result) {
          // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
          wx.showToast({
            icon:'none',
            title: '反馈发送成功',
            duration:2000
          })
          wx.switchTab({
            url: '../home/home'
          })
          console.log("日记创建成功, objectId:" + result.id);
        },
        error: function (result, error) {
          // 添加失败
          wx.showToast({
            icon: 'none',
            title: '反馈发送失败',
          })
          console.log('创建日记失败');

        }
      });



    }
    else{
      wx.showToast({
        icon: 'none',
        title: '您还有未填写的内容',
      })
    }
  },
  back: function () {


    wx.switchTab({
      url: '../home/home'
    })
  }


})