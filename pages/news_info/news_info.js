// pages/news_info/news_info.js
var Bmob = require("../../utils/bmob.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottom: !1,
    news: [],
    news_content: '',
    titleSelected: !1,
    showNews: "",
    hasNotice: !0,
    noticeContent: '',
    marquee_margin: 30,
    marqueePace: 1,
    interval: 20,
    showall: !1


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var updataDate;
    this.readnews()
    that.data.length = 16 * that.data.noticeContent.length,
      that.data.windowWidth = wx.getSystemInfoSync().windowWidth,
      that.scrolltxt();

  },

  readnews() {
    var that = this
    var news = Bmob.Object.extend("news_info");
    var query = new Bmob.Query(news);
    wx.showLoading({
      title: '加载中',
    })
    query.descending("date");
    query.limit(8)
    query.skip(this.data.news.length)
    query.find({
      success: function(result) {
        console.log("news", that.data.news)
        console.log(result.length, result)
        if (result.length > 0) {
          that.setData({
            bottom: !1,
            news: that.data.news.concat(result),
            noticeContent: "·最近更新：" + result[0].updatedAt.substring(0, 10) + "  ·更多资讯请访问华师新闻网"
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
      error: function(object, error) {
        console.log(result)
      }
    });
  },
  scrolltxt: function() {
    var t = this,
      e = t.data.length,
      a = t.data.windowWidth;
    if (e > a) var n = setInterval(function() {
      var a = e + t.data.marquee_margin,
        i = t.data.marqueeDistance;
      i < a ? t.setData({
        marqueeDistance: i + t.data.marqueePace
      }) : (t.setData({
        marqueeDistance: 0
      }), clearInterval(n), t.scrolltxt());
    }, t.data.interval);
    else t.setData({
      marquee_margin: 1e3
    });
  },
  closeNotice: function() {
    this.setData({
      hasNotice: !1
    });
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
    this.setData({
      bottom: !1,
      hasNotice: !0
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.titleSelected) {
      this.setData({
        bottom: !0
      })
      this.readnews()
    }
  },
  showDetail(e) {
    var that = this
    var news = this.data.news
    var content
    var news_content = []
    for (var h = 0; h < news.length; h++)
      if (news[h].id == e.currentTarget.dataset.id) {
        var c = news[h].attributes.content
        content = c.split("@")
        for (var i = 0; i < content.length; i++) {
          var n_c = new Object()
          if (content[i].length == 1 && " " == content[i]) {
            continue
          }
          if (content[i].indexOf("http://news.scnu.edu.cn/") > -1) {
            n_c.type = 2 //pic
          } else {
            n_c.type = 1 //text
          }

          n_c.content = content[i]
          news_content.push(n_c)

        }

        this.setData({
          showNews: news[h],
          news_content: news_content,
          bottom: !1
        })

        console.log(news_content)
        break;
      }
    this.setData({
      titleSelected: !0,
    })
  },
  back() {
    if (this.data.titleSelected) {
      this.setData({
        titleSelected: !1
      
  })}
  else{
    wx.switchTab({
      url: '../home/home',
    })
  }
  }
})