// pages/home/home.js
const Bmob = require('../../utils/bmob.js');
const app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageWidth: wx.getSystemInfoSync().windowWidth,//图片宽度
    //求购 d_type 0
    pub_notsell: [],
    //挂售 d_type 1
    want_notsell: [],

    currentTab: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'http://bmob-cdn-24874.b0.upaiyun.com/2019/05/22/2cb43f2c40426be880b120469bda7f83.png'
    }, {
      id: 1,
      type: 'image',
        url: 'http://bmob-cdn-24874.b0.upaiyun.com/2019/05/22/09ffbdfe40e89b8a80535107b4a876fb.png',
    }, {
      id: 2,
      type: 'image',
        url: 'http://bmob-cdn-24874.b0.upaiyun.com/2019/05/22/733398bd405051d0807587c4ccbe4e8b.png'
      },
      {
        id: 3,
        type: 'image',
        url: 'http://bmob-cdn-24874.b0.upaiyun.com/2019/05/23/0584d72540c1aa1a801bebfcac3856ae.png'
      }],
    cardCur:0,
    news_title:"hehe",
    news_content:"hehe",
    news_photo:"",
    auth: 1
  

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   


    //调取需求信息
    var that = this;
    var t = Bmob.Object.extend("demand")
    var q = new Bmob.Query(t);
    q.find({
      success: function (res) {
        var pub_notsell = [],
          want_notsell = [],
          pub_sell = [],
          want_sell = [];
        for (var s = 0; s < res.length; s++) {
          switch (res[s].attributes.d_type) {
            case 0:
              pub_notsell.push(res[s]);
              break;
            case 1:
              want_notsell.push(res[s]);
              break;
            case 2:
              pub_sell.push(res[s]);
              break;
            case 3:
              want_sell.push(res[s]);
              break;
          }
        }
        //console.log(pub_notsell, want_notsell, pub_sell, want_sell)
        that.setData({
          pub_notsell: pub_notsell,
          want_notsell: want_notsell,
          pub_sell: pub_sell,
          want_sell: want_sell,
          pub_all: pub_notsell.concat(pub_sell),
          want_all: want_notsell.concat(want_sell)
        })
        //console.log(that.data.pub_all, that.data.want_all)
        wx.hideLoading()
        wx.showToast({
          title: '上滑浏览宝贝更舒适',
          icon: 'none',
          duration: 3000
        })


      }
    })

    //获取用户手机长度
    wx.getSystemInfo({
      success: function(t) {
        var e = t.windowHeight,
          i = t.windowWidth,
          s = 750 * e / i - 110 - 108;
        console.log(s);
        that.setData({
          tabHeight: s-60
        });
      }
    });



  },


  switchNav: function(t) {
    console.log(t.target.dataset)
    if (t.target.dataset.currenttab != undefined) {
      t.target.dataset.currenttab != this.data.currentTab &&
        (this.setData({
          currentTab: t.target.dataset.currenttab,
          scrollTop: 0
        }), wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        }));
    } else {
      wx.showToast({
        title: '— 点到边界上了哦 — 再点击一次吧',
        icon: 'none',
        duration: 2000
      })
    }

   


  },
  //标签转换
  switchTab: function(t) {
    var e = t.detail.current;
    this.setData({
      currentTab: e,
      scrollTop: 0
    }), 
    wx.pageScrollTo({
      scrollTop: 400,
      duration: 0
    });
  },


  toDetailsTap: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: "/pages/goods_detail/goods_detail?id=" + e.currentTarget.dataset.id
    })
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
    this.setData({
      auth: app.globalData.auth
    })
    //调取需求信息
    var that = this;
    var t = Bmob.Object.extend("demand")
    var q = new Bmob.Query(t);
    q.find({
      success: function (res) {
        var pub_notsell = [],
          want_notsell = [],
          pub_sell = [],
          want_sell = [];
        for (var s = 0; s < res.length; s++) {
          switch (res[s].attributes.d_type) {
            case 0:
              pub_notsell.push(res[s]);
              break;
            case 1:
              want_notsell.push(res[s]);
              break;
            case 2:
              pub_sell.push(res[s]);
              break;
            case 3:
              want_sell.push(res[s]);
              break;
          }
        }
        //console.log(pub_notsell, want_notsell, pub_sell, want_sell)
        that.setData({
          pub_notsell: pub_notsell,
          want_notsell: want_notsell,
          pub_sell: pub_sell,
          want_sell: want_sell,
          pub_all: pub_notsell.concat(pub_sell),
          want_all: want_notsell.concat(want_sell)
        })
        //console.log(that.data.pub_all, that.data.want_all)
        wx.hideLoading()
        wx.showToast({
          title: '上滑浏览宝贝更舒适',
          icon: 'none',
          duration: 3000
        })


      }
    })

    var that = this
    var news = Bmob.Object.extend("news_info");
    var query = new Bmob.Query(news);
    wx.showLoading({
      title: '加载中',
    })
    query.descending("date");
    query.limit(1)
    //query.skip(this.data.news.length)
    query.find({
      success: function (result) {
        console.log("news", that.data.news)
        console.log(result.length, result)
        if (result.length > 0) {
          console.log(result)
          that.setData({
            news_title: result[0].attributes.title,
            news_content: result[0].attributes.content,
            news_photo: result[0].attributes.imgUrl

          })
        } else {
          that.setData({
            showall: !0
          })
        }
        wx.hideLoading()
        // that.data.length = 16 * that.data.noticeContent.length,
        //   that.data.windowWidth = wx.getSystemInfoSync().windowWidth,
        //   that.scrolltxt();
      },
      error: function (object, error) {
        console.log(result)
      }
    });

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

  },

  showDetail: function() {
    wx.navigateTo({
      url: ''
    });
  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  readnews() {
    var that = this
    var news = Bmob.Object.extend("news_info");
    var query = new Bmob.Query(news);
    wx.showLoading({
      title: '加载中',
    })
    query.descending("date");
    query.limit(1)
    query.skip(this.data.news.length)
    query.find({
      success: function (result) {
        console.log("news", that.data.news)
        console.log(result.length, result)
        if (result.length > 0) {
         console.log(result)
        } else {
          that.setData({
            showall: !0
          })
        }
        wx.hideLoading()
        // that.data.length = 16 * that.data.noticeContent.length,
        //   that.data.windowWidth = wx.getSystemInfoSync().windowWidth,
        //   that.scrolltxt();
      },
      error: function (object, error) {
        console.log(result)
      }
    });
  },
  showModal:function(){

wx.navigateTo({
  url: '../news_info/news_info',
})

  },
  swipclick: function (e) {
    console.log(this.data.cardCur)
    if (this.data.cardCur==1){
      wx.navigateTo({
        url: '../help/help',
      })
    }
    if (this.data.cardCur==2){

wx.navigateTo({
  url: '../suggestion/suggestion',
})

    }
    if (this.data.cardCur == 3) {

      wx.navigateTo({
        url: '../about/about',
      })

    }
  },
  


  
})