// pages/setwechatnumber/setwechatnumber.js
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
  back() {
    wx.switchTab({
      url: '../self/self',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  formSubmit: function (e) {
    if (e.detail.value.name){
      wx.showLoading({
        title: '正在设置',
      })
      console.log(e.detail.value.name)
wx.getStorage({
  key: 'user_id',
  success: function(res) {
console.log(res)
    var Diary = Bmob.Object.extend("_User");
    var query = new Bmob.Query(Diary);
    // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
    query.get(res.data, {
      success: function (result) {
        // 回调中可以取得这个 diary 对象的一个实例，然后就可以修改它了
        result.set('wechat', e.detail.value.name);
        wx.setStorage({
          key: 'my_wechatnumber',
          data: e.detail.value.name,
        })
        result.save();
        wx.hideLoading()
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        wx.switchTab({
          url: '../self/self',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        // The object was retrieved successfully.
      },
      error: function (object, error) {
        wx.hideLoading();

        wx.showToast({
          title: '设置失败',
          icon: 'fail',
          duration: 2000
        })
        wx.switchTab({
          url: '../self/self',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })

      }
    });


    



  }
})






    }

  }
})