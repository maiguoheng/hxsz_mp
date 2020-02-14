var app = getApp();
const Bmob = require('../../utils/bmob.js');


Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    tabItem: [{
        currentTab: 0,
        tabName: "发布的宝贝"
      },
      {
        currentTab: 1,
        tabName: "发布的求购"
      },
      {
        currentTab: 2,
        tabName: "收藏的宝贝"
      }
    ],
    currentTab: 0,
    datachange: !1,

    //求购 d_type 0
    pub_notsell: [],
    //挂售 d_type 1
    want_notsell: [],
    //已求购 d_type 2
    pub_sell: [],
    //已挂售 d_type 3
    want_sell: [],
    //发布的：0与2合并
    pub_all: [],
    //求购的：1和3合并
    want_all: [],
    like: [],
    userInfo: {},
    hasUserInfo: false,
    currentTab: -1,
    auth: 1,
    openSetting: !1
  },
  attached() {
    //组件时调用加载完毕
    console.log("success")
    var haschange = wx.getStorageSync('haschange')

    if (haschange) {
      this.setData({
        datachange: !0
      })
      wx.setStorage({
        key: 'haschange',
        data: !1,
      })
    }

    this.setData({
      auth: app.globalData.auth
    })

  },
  pageLifetimes: {

    // 组件所在页面的生命周期函数
    show() {
      console.log("onshow")
      var that = this
      wx.getStorage({
        key: 'user_id',
        success: function(res) {
          that.getinfo(res.data)
          that.check_collect()

        },
      })
    },

  },

  methods: {
    toAboutTap: function(e) {
      wx.navigateTo({
        url: "/pages/about/about"
      })
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

    switchTab: function(t) {
      var e = t.detail.current;
      this.setData({
        currentTab: e,
        scrollTop: 0
      }), wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
    },
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(1) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(1) + 'W'
      }
      return e
    },
    toDetailsTap: function(e) {
      console.log(e.currentTarget.dataset.id)
      wx.navigateTo({
        url: "/pages/goods_detail/goods_detail?id=" + e.currentTarget.dataset.id
      })
    },
    CopyLink(e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.link,
        success: res => {
          wx.showToast({
            title: '已复制',
            duration: 2000,
          })
        }
      })
    },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    showQrcode() {
      wx.previewImage({
        urls: ['https://image.weilanwl.com/color2.0/zanCode.jpg'],
        current: 'https://image.weilanwl.com/color2.0/zanCode.jpg' // 当前显示图片的http链接      
      })
    },

    getUserInfo: function(e) {
      var that = this
      if (e.detail.userInfo) {
        app.globalData.userInfo = e.detail.userInfo
        console.log(e)
        that.setData({
          datachange: !1,
          currentTab: 0,
          userInfo: e.detail.userInfo,
          hasUserInfo: true,
        })
        wx.showLoading({
          title: '加载中...',
        })

        wx.getSystemInfo({
          success: function(t) {
            var e = t.windowHeight,
              i = t.windowWidth,
              s = 750 * e / i - 110 - 108;
            that.setData({
              tabHeight: s
            });
          }
        });

        var user = new Bmob.User();
        wx.login({
          success: function(res) {
            console.log("res", res)
            user.loginWithWeapp(res.code).then(function(user) {
                console.log("user", user)
                var openid = user.attributes.authData.weapp.openid;
                wx.setStorageSync('user_openid', openid)

                var like, u = Bmob.Object.extend("_User");
                var query = new Bmob.Query(u);
                query.get(user.id, {
                  success: function(result) {
                    // console.log(result)
                    console.log(result)
                    wx.setStorageSync('user_id', result.id)
                    wx.setStorageSync('my_nick', result.get("nickname"))
                    wx.setStorageSync('my_username', result.get("username"))
                    wx.setStorageSync('my_sex', result.get("sex"))
                    wx.setStorageSync('my_avatar', result.get("userPic"))
                    if (result.get("wechat")) {
                      wx.setStorageSync('my_wechatnumber', result.get("wechat"))
                    }
                    if (result.get("mobilePhoneNumber")) {
                      wx.setStorageSync('my_phonenumber', result.get("mobilePhoneNumber"))
                    }
                    //表明已认证过，用于前端显示
                    wx.setStorageSync('isPermissed', true)
                    //表明已认证过，用于前端显示
                    wx.setStorageSync('isPermissed2', true)

                    that.check_collect()
                    //保存收藏的东西
                    // let user = Bmob.Object.extend("_User");
                    // let query = new Bmob.Query(user);
                    // query.get(wx.getStorageSync("user_id"), {
                    //   success: function(result) {
                    //     let tmpColletions = result.get("collection");
                    //     wx.setStorageSync('collection', tmpColletions)
                    //   },
                    //   error: function(result, error) {
                    //     console.log("查询失败");
                    //   }
                    // });
                    // let tmpColletions = result.get("collection");

                    // like = result.attributes.collection

                    // var t = Bmob.Object.extend("demand")
                    // var mq = new Bmob.Query(t);
                    // var havedel = false;
                    // var new_collect = [];
                    // mq.containedIn("objectId", like);
                    // mq.find({
                    //   success: function(res) {
                    //     // console.log(res)
                    //     var save = [];

                    //     // 判断是否有收藏的宝贝被删除
                    //     if (res.length < like.length) {
                    //       havedel = true
                    //     }
                    //     for (var i = 0; i < res.length; i++) {
                    //       save.push(res[i])
                    //       if (havedel == true) {
                    //         new_collect.push(res[i].id)
                    //       }
                    //     }
                    //     that.setData({
                    //       like: save
                    //     });
                    //     (havedel == true) && (result.set('collection', new_collect), result.save())

                    //   }
                    // });

                  },
                  error: function(result, error) {
                    console.log("查询失败");
                  }
                });
                if (user.get("nickname")) {
                  //  非第一次登陆
                  // 查看已发布宝贝与求购的数量
                  that.getinfo(user.id)

                  // var t = Bmob.Object.extend("demand")
                  // var q = new Bmob.Query(t);
                  // q.equalTo("user_objectid", user.id)
                  // q.find({
                  //   success: function(res) {
                  //     var pub_notsell = [],
                  //       want_notsell = [],
                  //       pub_sell = [],
                  //       want_sell = [];
                  //     for (var s = 0; s < res.length; s++) {
                  //       switch (res[s].attributes.d_type) {
                  //         case 0:
                  //           pub_notsell.push(res[s]);
                  //           break;
                  //         case 1:
                  //           want_notsell.push(res[s]);
                  //           break;
                  //         case 2:
                  //           pub_sell.push(res[s]);
                  //           break;
                  //         case 3:
                  //           want_sell.push(res[s]);
                  //           break;
                  //       }
                  //     }
                  //     // console.log(pub_notsell, want_notsell, pub_sell, want_sell)
                  //     that.setData({
                  //       pub_notsell: pub_notsell,
                  //       want_notsell: want_notsell,
                  //       pub_sell: pub_sell,
                  //       want_sell: want_sell,
                  //       pub_all: pub_notsell.concat(pub_sell),
                  //       want_all: want_notsell.concat(want_sell)
                  //     })
                  //     console.log(that.data.pub_all, that.data.want_all)
                  //     wx.hideLoading()
                  //     wx.showToast({
                  //       title: '上滑浏览宝贝更舒适',
                  //       icon: 'none',
                  //       duration: 3000
                  //     })


                  //   }
                  // })

                } else {
                  //第一次登陆，注册成功的情况

                  //保存用户其他信息，比如昵称头像之类的
                  wx.getUserInfo({
                    success: function(result) {

                      // var userInfo = result.userInfo;
                      // var avatarUrl = userInfo.avatarUrl;
                      var userData = result
                      var userInfo = result.userInfo
                      var nickName = userInfo.nickName
                      var avatarUrl = userInfo.avatarUrl
                      var sex = userInfo.gender

                      var u = Bmob.Object.extend("_User");
                      var query = new Bmob.Query(u);
                      // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
                      query.get(user.id, {
                        success: function(result) {
                          // 自动绑定之前的账号


                          result.set('username', nickName);
                          result.set('password', openid);
                          //console.log(userData.openid)
                          result.set("nickname", nickName);
                          result.set("userPic", avatarUrl);
                          result.set("userData", userData);
                          result.set('sex', sex);
                          result.set('collection', []);
                          result.save();
                          wx.hideLoading()
                        }
                      });

                    }
                  });
                }
              },
              function(err) {
                console.log(err, 'errr');
              });

          }
        })
      }
    },
    getinfo: function(user_objectid) {
      console.log("user_objectid", user_objectid)
      var t = Bmob.Object.extend("demand"),
        that = this,
        q = new Bmob.Query(t);
      q.equalTo("user_objectid", user_objectid)
      q.find({
        success: function(res) {
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
          // console.log(pub_notsell, want_notsell, pub_sell, want_sell)
          that.setData({
            pub_notsell: pub_notsell,
            want_notsell: want_notsell,
            pub_sell: pub_sell,
            want_sell: want_sell,
            pub_all: pub_notsell.concat(pub_sell),
            want_all: want_notsell.concat(want_sell)
          })
          wx.hideLoading()
          wx.showToast({
            title: '上滑浏览宝贝更舒适',
            icon: 'none',
            duration: 1500
          })

        }
      })
    },
    check_collect() {
      var that = this
      var user_id = wx.getStorageSync("user_id")
      var like, u = Bmob.Object.extend("_User");
      var query = new Bmob.Query(u);
      query.get(user_id, {
        success: function(result) {
          console.log(result)
          let user = Bmob.Object.extend("_User");
          let query = new Bmob.Query(user);
          query.get(user_id, {
            success: function(result) {
              let tmpColletions = result.get("collection");
              wx.setStorageSync('collection', tmpColletions)
            },
            error: function(result, error) {
              console.log("查询失败");
            }
          });
          let tmpColletions = result.get("collection");

          like = result.attributes.collection

          var t = Bmob.Object.extend("demand")
          var mq = new Bmob.Query(t);
          var havedel = false;
          var new_collect = [];
          mq.containedIn("objectId", like);
          mq.find({
            success: function(res) {
              // console.log(res)
              var save = [];
              // 判断是否有收藏的宝贝被删除
              if (res.length < like.length) {
                havedel = true
              }
              for (var i = 0; i < res.length; i++) {
                save.push(res[i])
                if (havedel == true) {
                  new_collect.push(res[i].id)
                }
              }
              that.setData({
                like: save
              });
              (havedel == true) && (result.set('collection', new_collect), result.save())

            }
          });
        }
      })
    },
    changsetting() {
      let t = this.data.openSetting
      this.setData({
        openSetting: !t
      })
    },

    setwechatnumber() {
      wx.navigateTo({
        url: '../setwechatnumber/setwechatnumber',
      })
    },
    setphonenumber() {
      wx.navigateTo({
        url: '../setphonenumber/setphonenumber',
      })
    }
  }



})