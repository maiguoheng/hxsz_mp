// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var a = {
      name: "xiao",
      age: "16"
    }
    var b = {
      "qw": "chen",
      er: "20"
    }
    var c = []
    c.push(a)
    console.log(c)

    c.push(b)
    console.log(c)
    var d = ['1', '2', '3']
    var e = ['4', '5', '6']
    d.push(e)
    console.log(d)
    d = d.concat(e)
    console.log(d)

    this.eee("abcd",datas => {
      console.log(datas+"ryturt")
    })

  },

  eee: function(m,callback) {
    console.log(m)
   callback(5)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})