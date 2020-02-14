// pages/goods_detail/goods_detail.js
const Bmob = require('../../utils/bmob.js');
var demand_objid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    good_info: '',
    setting: !1,
    // 记录 挂售0/ 求购1/ 已挂售2/已求购3
    status: '',
    // 该信息是否由浏览者发布
    owner: !1,
    demand_info: '',
    collect: !1,
    show_sex: '',
    show_touxiang: '',
    show_nickname: '',
    show_wechat: '',
    datachange: !1,
    pub_time: '',
    has_login: !1,
    show_phonenumber: '',

    // 更多物品
    //求购 d_type 0
    pub_notsell: [],
    //挂售 d_type 1
    want_notsell: [],
    currentTab: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var that = this
    var user_id = wx.getStorageSync("user_id")
    if (!user_id) {
      wx.showToast({
        title: '你还未登陆',
        icon: 'none',
        duration: 3000
      })
      user_id = -1;

    } else {
      that.setData({
        has_login: !0
      })
    }

    var u = Bmob.Object.extend("good_pic");
    var query = new Bmob.Query(u)

    query.equalTo("d_objid", e.id)
    query.find({
      success: function(result) {
        let owner_objid = result[0].attributes.owner_objid
        if (owner_objid == user_id) {
          that.setData({
            owner: !0,
            good_info: result[0].attributes,
            status: result[0].attributes.d_type,
            show_nickname: wx.getStorageSync('my_username'),
            show_sex: wx.getStorageSync('my_sex'),
            show_touxiang: wx.getStorageSync('my_avatar')
          })
        } else {
          var mm = Bmob.Object.extend("_User")
          var q = new Bmob.Query(mm)
          q.get(owner_objid, {
            success: function(rrrr) {
              console.log(rrrr)
              that.setData({
                show_nickname: rrrr.attributes.nickname,
                show_sex: rrrr.attributes.sex,
                show_touxiang: rrrr.attributes.userPic
                // show_wechat: rrrr.attributes.wechat,
                // show_phonenumber:rrrr.attributes.mobilePhoneNumber
              })
            }
          })
          that.setData({
            owner: !1,
            good_info: result[0].attributes,
            status: result[0].attributes.d_type
          })

          // 获取更多物品信息
          console.log("获取更多", owner_objid)
          var t = Bmob.Object.extend("demand")
          var qq = new Bmob.Query(t)

          qq.equalTo('user_objectid', owner_objid)
          qq.lessThan('d_type', 2)
          qq.find({
            success: function(res) {
              let pub_notsell = [],
                want_notsell = []
              console.log(res)
              for (let i = 0; i < res.length; i++)
                res[i].attributes.d_type == 0 ? pub_notsell.push(res[i]) : want_notsell.push(res[i])
              console.log("pub_notsell", pub_notsell)
              console.log("want_notsell", want_notsell)
              that.setData({
                pub_notsell: pub_notsell,
                want_notsell: want_notsell
              })

            }
          })


        }
      }
    })

    var x = Bmob.Object.extend("demand");
    var q = new Bmob.Query(x)
    q.equalTo("objectId", e.id)

    q.find({
      success: function(result) {
        demand_objid = result[0].id
        console.log(result)
        that.setData({
          pub_time: result[0].createdAt.substring(0, 10),
          demand_info: result[0].attributes,
          show_wechat: result[0].attributes.wechat,
          show_phonenumber: result[0].attributes.mobilePhoneNumber
        })

        if (that.data.has_login) {
          var x = Bmob.Object.extend("_User");
          var q = new Bmob.Query(x)
          q.equalTo("objectId", user_id)
          q.find({
            success: function(result) {
              var collection = result[0].attributes.collection
              if (that.data.owner) {
                // that.setData({
                //   show_wechat: result[0].attributes.wechat,
                //   show_phonenumber: result[0].attributes.mobilePhoneNumber
                // })
              }
              for (var i = 0; i < collection.length; i++) {
                if (collection[i] == demand_objid) {
                  that.setData({
                    collect: !0
                  })
                  break
                }
              }

            }
          })
        }
      }
    })

    wx.getSystemInfo({
      success: function(t) {
        var e = t.windowHeight,
          i = t.windowWidth,
          s = 750 * e / i - 110 - 108;
        console.log(s);
        that.setData({
          tabHeight: s - 60
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

  toDetailsTap: function(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: "/pages/goods_detail/goods_detail?id=" + e.currentTarget.dataset.id
    })
  },
  back() {
    if (this.data.setting) {
      this.setData({
        setting: !1
      })
    } else {
      if (this.data.datachange) {
        wx.setStorage({
          key: 'haschange',
          data: !0,
        })
        wx.switchTab({
          url: '../self/self',
        })
      } else {
        //获取页面栈
        let pages = getCurrentPages();
        if (pages.length > 1) {
          //上一个页面实例对象
          let prePage = pages[pages.length - 2];
          if (prePage.__route__ == "pages/market/market") {
            wx.reLaunch({
              url: '../market/market',
            })
          } else if (prePage.__route__ == "pages/neededMarket/neededMarket") {
            wx.reLaunch({
              url: '../neededMarket/neededMarket',
            })
          } else {
            wx.navigateBack({
              delta: 1
            })
          }
        }

      }
    }

  },
  changestatus(e) {
    var that = this
    console.log(e)
    var selstatus = e.currentTarget.dataset.status
    if (selstatus == that.data.status) {
      wx.showToast({
        title: '信息没改变哦',
        image: '../static/images/注意.png',
        duration: 1200
      })
    } else {
      var x = Bmob.Object.extend("demand");
      var q = new Bmob.Query(x)
      var demand_objid = that.data.good_info.d_objid

      wx.showLoading({
        title: '加载中',
      })
      q.get(demand_objid, {
        success: function(res) {
          console.log(res)
          res.set('d_type', Number(selstatus))
          res.save()
          var m = Bmob.Object.extend("good_pic");
          var q = new Bmob.Query(m)
          q.equalTo("d_objid", demand_objid)


          q.find({
            success: function(res) {
              console.log(res)
              res[0].set('d_type', Number(selstatus))
              res[0].save()
              that.setData({
                status: selstatus,
                datachange: !0
              })
              wx.showToast({
                title: '设置成功',
                icon: 'success',
                duration: 1200
              })
            }
          })
          wx.hideLoading()



        }
      })



    }

  },

  collect() {
    if (!this.data.has_login) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
      return
    }

    var that = this;

    that.setData({
      collect: !that.data.collect
    })
    var currentCollect = that.data.collect

    var uuu = Bmob.Object.extend("demand"),
      qqq = new Bmob.Query(uuu)
    qqq.equalTo("objectId", demand_objid)
    qqq.find({
      success: function(d_res) {
        var collectNum = d_res[0].attributes.collectNum
        var u = Bmob.Object.extend("_User"),
          query = new Bmob.Query(u)
        var user_id = wx.getStorageSync("user_id")
        query.equalTo("objectId", user_id)
        wx.showLoading({
          title: '收藏中···',
        })
        query.find({
          success: function(result) {
            //原来未收藏
            if (currentCollect == true) {
              collectNum += 1

              var save = result[0].attributes.collection
              save.push(demand_objid)
              result[0].set('collection', save)
              result[0].save()

              // 修改本地缓存
              wx.setStorage({
                key: 'collection',
                data: save,
              })

              wx.hideLoading()
              wx.showToast({
                title: '已收藏',
                icon: 'success',
                duration: 1000
              })
            } else {
              collectNum -= 1

              //收藏->未收藏
              var save = result[0].attributes.collection
              for (var i = 0; i < save.length; i++) {
                if (save[i] == demand_objid) {
                  save.splice(i, 1)
                  break;
                }
              }

              result[0].set('collection', save)
              result[0].save()

              wx.setStorage({
                key: 'collection',
                data: save,
              })

              wx.hideLoading()
              wx.showToast({
                title: '已取消',
                icon: 'success',
                duration: 1000
              })
            }

            d_res[0].set('collectNum', collectNum)
            d_res[0].save()

          },
          complete: function() {
            
          }
        })
      }
    })


  },
  previewImg(e) {
    var urls = this.data.good_info.all_pic_url
    wx.previewImage({
      urls: urls,
      current: e.currentTarget.dataset.id
    })

  },
  setStatus() {
    this.setData({
      setting: !0
    })

  },
  deletedeproduct() {

    var that = this
    var d_objid = that.data.good_info.d_objid

    wx.showModal({
      title: '是否删除',
      content: '删除后将无法恢复，请谨慎选择',
      cancelText: '再想想',
      confirmText: '确认删除',
      confirmColor: '#ff1744',
      success(res) {
        if (res.confirm) {
          var x = Bmob.Object.extend("demand")
          var q = new Bmob.Query(x)
          q.get(d_objid, {
            success: function(res) {
              console.log("demand", res)
              res.destroy({
                success: function() {
                  console.log('删除demand表数据成功')
                }
              })

            }
          })

          var x = Bmob.Object.extend("good_pic")
          var del = new Bmob.Query(x)
          del.equalTo('d_objid', d_objid)
          del.find({
            success: function(res) {
              console.log("good_pic", res)
              res[0].destroy({
                success: function() {
                  console.log('删除good_pic表数据成功')
                }
              })
              console.log("baocun2")
            }
          })

          wx.switchTab({
            url: '../self/self',
            success: function() {
              wx.setStorage({
                key: 'haschange',
                data: !0,
              })
              wx.showToast({
                title: '已删除',
                duration: 1000,
              })
            }
          })
        }
      }
    })
  },

  copywechat() {
    if (!this.data.has_login) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    } else {

      var that = this
      if (!that.data.owner) {
        if (that.data.status == 2 || that.data.status == 3) {
          wx.showToast({
            title: '该商品已结束交易了,换个试试',
            icon: '../static/images/注意.png',
            duration: 1200
          })
        } else {
          wx.showModal({
            title: '联系说明',
            content: '由于采用面交方式，不支持线上付款。点击确认即可复制发布者微信号以便在小程序外联系。交易需谨慎！',
            cancelText: '再想想',
            confirmText: '联系他',
            confirmColor: '#4fc08d',
            success(res) {
              if (res.confirm) {
                wx.setClipboardData({
                  data: '(from 华师闲置)发布者微信：' + that.data.show_wechat + '发布者电话号码' + that.data.show_phonenumber,
                  success: function(res) {　　　　　　　　　　　　
                    wx.showToast({
                      icon: 'none',
                      title: '(from 华师闲置)发布者微信：' + that.data.show_wechat + '发布者电话号码' + that.data.show_phonenumber + '复制成功',
                      duration: 5000
                    })　　　　　　　　　　
                  }
                })

              } else if (res.cancel) {
                console.log('再想想')
              }
            },
            fail() {
              wx.showToast({
                title: '复制失败',
                icon: 'none'
              })　　　　
            }
          })
        }
      } else {
        wx.showToast({
          title: '你是该商品的发布者~',
          icon: 'none'
        })

      }
    }
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