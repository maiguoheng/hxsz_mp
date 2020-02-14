// pages/market/market.js
var Bmob = require("../../utils/bmob.js");
const app = getApp();
let col1H = 0;
let col2H = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    isPermissed2: wx.getStorageSync("isPermissed2"),
    marketData: [],
    tmpData: [],
    reachCount: 0,
    isEnd: false,
    hasChanged: false,
    TabCur: 0,
    scrollLeft: 0,
    types: ['全部', '电脑数码', '家用电器', '运动户外', '服饰鞋包', '个护化妆', '日用百货', '食品保健', '图书音像', '文化娱乐', '文具用品'],
    selectedIndex: 0,
    widthcoefficient: 0,
    col1: [],
    col2: [],
    keyword: '',
    auth: 1,
    onLoad:!1
  },



  onImageLoad: function(e) {
    console.log("omimageload", e)
    let dataIndex = e.target.dataset.index - 1;
    let scale = e.detail.width / e.detail.height; //比例计算
    let oImgH = 346 / scale; //图片高度
    let imageObj = this.data.listData[dataIndex];

    let col1 = this.data.col1;
    let col2 = this.data.col2;

    //判断当前图片添加到左列还是右列
    if (col1H <= col2H) {
      col1H += oImgH + this.data.widthcoefficient;
      col1.push(imageObj);
    } else {
      col2H += oImgH + this.data.widthcoefficient;
      col2.push(imageObj);
    }

    let data = {
      col1: col1,
      col2: col2
    };

    this.setData(data);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          //根据机型获取rpx和px的转换系数
          widthcoefficient: res.screenHeight
        });
      }
    });
    wx.showLoading({
      title: '正在加载中...',
      mask: true,
    });
    getGoodsInfo(that, that.data.TabCur);
  },
  /**
   * 点击图片预览
   */
  tapImg: function(e) {
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接
      urls: e.target.dataset.list // 需要预览的图片http链接列表
    })
  },
  /**
   * 点击收藏
   */
  /**
 * 点击收藏
 */
  tapCollect: function (e) {
    console.log(e)
    let flag = e.target.dataset.src.likeIt;
    console.log(flag)
    if (!flag && this.data.isPermissed2) {
      let objectId = -1;
      if (e.target.dataset.loc == "left") {
        let goodIndex = -1;
        for (let i = 0; i < this.data.col1.length; i++) {
          if (this.data.col1[i].index == e.target.dataset.src.index) {
            goodIndex = i;
            break;
          }
        }

        this.data.col1[goodIndex].likeIt = true;
        this.data.col1[goodIndex].heartNum += 1;

        objectId = this.data.col1[goodIndex].id;
      } else {
        let goodIndex = -1;
        for (let i = 0; i < this.data.col2.length; i++) {
          if (this.data.col2[i].index == e.target.dataset.src.index) {
            goodIndex = i;
          }
        }
        this.data.col2[goodIndex].likeIt = true;
        this.data.col2[goodIndex].heartNum += 1;

        objectId = this.data.col2[goodIndex].id;
      }

      let userId = wx.getStorageSync("user_id");

      //后端添加收藏数组，并在本地存一份加速读取
      let user = Bmob.Object.extend("_User");
      let userQuery = new Bmob.Query(user);
      userQuery.get(userId, {
        success: function (result) {
          let newCollections = result.attributes.collection;
          newCollections.push(objectId);
          wx.setStorageSync("collection", newCollections);
          result.set("collection", newCollections);
          result.save();
        },
        error: function (object, error) {
          console.log("查询失败1");
        }
      });
      //后端增加收藏数量
      let demand = Bmob.Object.extend("demand");
      let demandQuery = new Bmob.Query(demand);
      demandQuery.get(objectId, {
        success: function (result) {
          let newCollectNum = result.attributes.collectNum;
          newCollectNum += 1;
          result.set("collectNum", newCollectNum);
          result.save();
        },
        error: function (object, error) {
          console.log("查询失败2");
        }
      });
    } else if (flag && this.data.isPermissed2) {
      let objectId = -1;
      if (e.target.dataset.loc == "left") {
        let goodIndex = -1;
        for (let i = 0; i < this.data.col1.length; i++) {
          if (this.data.col1[i].index == e.target.dataset.src.index) {
            goodIndex = i;
          }
        }

        this.data.col1[goodIndex].likeIt = false;
        this.data.col1[goodIndex].heartNum -= 1;

        objectId = this.data.col1[goodIndex].id;
      } else {
        let goodIndex = -1;
        for (let i = 0; i < this.data.col2.length; i++) {
          if (this.data.col2[i].index == e.target.dataset.src.index) {
            goodIndex = i;
          }
        }
        this.data.col2[goodIndex].likeIt = false;
        this.data.col2[goodIndex].heartNum -= 1;

        objectId = this.data.col2[goodIndex].id;
      }
      let userId = wx.getStorageSync("user_id");

      //后端减少收藏数组，并在本地存一份加速读取
      let user = Bmob.Object.extend("_User");
      let userQuery = new Bmob.Query(user);
      userQuery.get(userId, {
        success: function (result) {
          let newCollections = result.attributes.collection;
          let index = newCollections.indexOf(objectId);
          if (index > -1) {
            newCollections.splice(index, 1);
          }
          wx.setStorageSync("collection", newCollections);
          result.set("collection", newCollections);
          result.save();
        },
        error: function (object, error) {
          console.log("查询失败3");
        }
      });
      //后端减少收藏数量
      let demand = Bmob.Object.extend("demand");
      let demandQuery = new Bmob.Query(demand);
      demandQuery.get(objectId, {
        success: function (result) {
          let newCollectNum = result.attributes.collectNum;
          newCollectNum -= 1;
          result.set("collectNum", newCollectNum);
          result.save();
        },
        error: function (object, error) {
          console.log("查询失败2");
        }
      });
    } else {
      wx.hideLoading()
      wx.showToast({
        title: '未进行授权！',
        image: "../static/images/注意.png",
        duration: 3000
      });
    }

    this.setData({
      col1: this.data.col1,
      col2: this.data.col2,
      isPermissed2: this.data.isPermissed2
    })
  },
  /**
   * 点击卡片查看商品详情
   */
  toDetailsTap: function(e) {
    //如果点收藏则不会发生跳转，否则跳转
    if (e.target.dataset.id) {
      wx.navigateTo({
        url: "/pages/goods_detail/goods_detail?id=" + e.target.dataset.id
      })
    }

  },
  tabSelect: function(e) {
    let that = this;
    let typeId = e.currentTarget.dataset.id;
    if (that.data.selectedIndex != typeId) {
      col1H = 0;
      col2H = 0;
      that.setData({
        listData: [],
        marketData: [],
        tmpData: [],
        reachCount: 0,
        keyword: '',
        isEnd: false,
        col1: [],
        col2: [],
        TabCur: typeId,
        scrollLeft: (typeId - 1) * 60,
        selectedIndex: typeId
      });
      wx.showLoading({
        title: '正在加载中...',
        mask: true,
      });
      getGoodsInfo(that, typeId);
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  searchInfo: function(e) {
    let that = this
    var keyword = e.detail.value
    this.setData({
      keyword: keyword,
      selectedIndex: 0,
      TabCur: 0,
      listData: [],
      marketData: [],
      tmpData: [],
      reachCount: 0,
      col1: [],
      col2: []
    })
    getGoodsInfo(that, 0, keyword)
  },
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示，用于切换tabBar时重新加载
   */
  onShow: function() {

    if(this.data.onLoad){
    //保证每次点击都会刷新数据
    wx.showLoading({
      title: '正在加载中...',
      mask: true,
    });
    getGoodsInfo(this, this.data.TabCur);
    }

    this.setData({
      auth: app.globalData.auth
    })


  },
  /**
   * 点击tabBar事件
   */
  onTabItemTap(item) {
    let that = this;
    let isPermissed2 = wx.getStorageSync("isPermissed2");
    //保证只有在第一次授权后才页面重新更新页面，否则不更新
    if (that.data.hasChanged != isPermissed2 && !that.data.isPermissed2) {
      resetDatas(that);
      wx.switchTab({
        url: '../neededMarket/neededMarket',
        success: function(e) {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      });
      that.data.hasChanged = true;
    }
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
    let that = this;
    if (!that.data.isEnd) {
      wx.showLoading({
        title: '正在加载中...',
        mask: true,
      })
      getGoodsInfo(that, that.data.TabCur);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
//最后一条数据的下标为n
function setDatas(n, res, marketData, callback, that) {
  if (n < 0) {
    callback(marketData);
  }
  if (n >= 0) {
    //找发布人
    let user = Bmob.Object.extend("_User");
    let query = new Bmob.Query(user);
    query.get(res[n].attributes.user_objectid, {
      success: function(result) {
        // The object was retrieved successfully.
        let tmpUserName = result.get("username");
        //判断是否认证，已认证才显示收藏情况
        if (wx.getStorageSync("isPermissed2")) {
          //取已收藏的物品，采用本机缓存加快速度
          let user = Bmob.Object.extend("_User");
          let query = new Bmob.Query(user);
          let isLiked = false;
          let tmpColletions = wx.getStorageSync("collection");
          if (tmpColletions) {
            for (let item in tmpColletions) {
              if (res[n].id == tmpColletions[item]) {
                isLiked = true;
                break;
              }
            }
          }
          let data = {
            objectId: res[n].id,
            index: that.data.listData.length + n + 1,
            description: res[n].attributes.g_name,
            heartNum: res[n].attributes.collectNum,
            value: res[n].attributes.price,
            position: res[n].attributes.place,
            id: res[n].id,
            d_number: res[n].attributes.d_number,
            likeIt: isLiked,
            imgUrl: [
              res[n].attributes.head_pic_url
            ],
            publisher: tmpUserName
          };
          marketData.push(data);
          setDatas(n - 1, res, marketData, callback, that);
        } else {
          //未认证不显示
          let data = {
            objectId: res[n].id,
            index: that.data.listData.length + n + 1,
            description: res[n].attributes.g_name,
            heartNum: res[n].attributes.collectNum,
            value: res[n].attributes.price,
            position: res[n].attributes.place,
            id: res[n].id,
            d_number: res[n].attributes.d_number,
            likeIt: false,
            imgUrl: [
              res[n].attributes.head_pic_url
            ],
            publisher: tmpUserName
          };
          marketData.push(data);
          setDatas(n - 1, res, marketData, callback, that);
        }
      },
      error: function(result, error) {
        console.log("查询失败");
      }
    });
  }
}

function getGoodsInfo(that, typeId, keyword = '') {

  let t = Bmob.Object.extend("demand")
  let q = new Bmob.Query(t);
  q.descending("createdAt");
  q.equalTo("d_type", 1);

  if (typeId != 0) {
    q.equalTo("g_type", that.data.types[typeId]);
  }


  q.limit(8);
  q.skip(that.data.listData.length);
  q.find({
    success: function(res) {
      let m = res.length - 1;
      //能读出数据时
      if (m >= 0) {
        let result = []
        if (keyword.length != 0) {
          for (let i = 0; i < res.length; i++) {
            if (res[i].attributes.g_name.indexOf(keyword) != -1) {
              result.push(res[i])
            }
          }
          res = result
        }

        setDatas(res.length - 1, res, that.data.marketData,
          (datas) => {
            that.data.tmpData = that.data.tmpData.concat(datas.reverse());
            that.data.marketData = [];
            let goods = that.data.tmpData
            that.setData({
              listData: goods,
              isPermissed2: wx.getStorageSync("isPermissed2"),
              onLoad:!0
            })
          }, that
        );
      } else {
        that.data.isEnd = true;
      }
      setTimeout(function() {
        wx.hideLoading()
      }, 700);

    }
  });
}

function resetDatas(that) {
  col1H = 0;
  col2H = 0;
  that.setData({
    listData: [],
    marketData: [],
    tmpData: [],
    reachCount: 0,
    isEnd: false,
    hasChanged: false,
    TabCur: 0,
    scrollLeft: 0,
    col1: [],
    col2: []
  })
}