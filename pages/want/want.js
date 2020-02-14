// pages/sell/sell.js
const app = getApp();
var Bmob = require("../../utils/bmob.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    picker: ['石牌', '大学城', '南海'],
    picker1: ['电脑数码', '家用电器', '运动户外', '服饰鞋包', '个护化妆', '日用百货', '食品保健', '图书音像', '文化娱乐', '文具用品'],
    textareaBValue: '',
    modalName: null,
    userid: null,
    number: '',
    wechat_number: '',
    modalName_phone: null
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


  ChooseImage() {
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }




        // var urlArr = new Array();
        // // var urlArr={};
        // var tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths)
        // var imgLength = tempFilePaths.length;
        // if (imgLength > 0) {
        //   var newDate = new Date();
        //   var newDateStr = newDate.toLocaleDateString();

        //   var j = 0;
        //   //如果想顺序变更，可以for (var i = imgLength; i > 0; i--)
        //   for (var i = 0; i < imgLength; i++) {
        //     var tempFilePath = [tempFilePaths[i]];
        //     var extension = /\.([^.]*)$/.exec(tempFilePath[0]);
        //     if (extension) {
        //       extension = extension[1].toLowerCase();
        //     }
        //     var name = newDateStr + "." + extension;//上传的图片的别名

        //     var file = new Bmob.File(name, tempFilePath);
        //     file.save().then(function (res) {
        //       wx.hideNavigationBarLoading()
        //       var url = res.url();
        //       console.log("第" + i + "张Url" + url);

        //       urlArr.push({ "url": url });
        //       j++;
        //       console.log(j, imgLength);
        //       // if (imgLength == j) {
        //       //   console.log(imgLength, urlArr);
        //       //如果担心网络延时问题，可以去掉这几行注释，就是全部上传完成后显示。
        //       //showPic(urlArr, that)
        //       // }

        //     }, function (error) {
        //       console.log(error)
        //     });

        //   }




        // }




      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除图片',
      content: '确定要删除这张图片么',
      cancelText: '再看看',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  }, PickerChange1(e) {
    console.log(e);
    this.setData({
      index1: e.detail.value
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  textareaBInput(e) {
    this.setData({
      textareaBValue: e.detail.value
    })
  },
  formSubmit: function (e) {
    var that = this
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (e.detail.value.name && e.detail.value.phone_number && e.detail.value.s_price && e.detail.value.schoolarea && e.detail.value.sort && e.detail.value.wechat_number && e.detail.value.detail && this.data.imgList.length > 0) {

      wx.showLoading({
        title: '发布中',
      })
      function asyncFunc1() {
        return new Promise(function (resolve, reject) {





          var urlArr = new Array();
          // var urlArr={};
          var tempFilePaths = that.data.imgList;
          console.log(tempFilePaths)
          var imgLength = tempFilePaths.length;
          if (imgLength > 0) {
            var newDate = new Date();
            var newDateStr = newDate.toLocaleDateString();

            var j = 0;
            //如果想顺序变更，可以for (var i = imgLength; i > 0; i--)
            for (let i = 0; i < imgLength; i++) {
              let tempFilePath = [tempFilePaths[i]];
              let extension = /\.([^.]*)$/.exec(tempFilePath[0]);
              if (extension) {
                extension = extension[1].toLowerCase();
              }
              let name = newDateStr + "." + extension;//上传的图片的别名

              let file = new Bmob.File(name, tempFilePath);
              file.save().then(function (res) {
                wx.hideNavigationBarLoading()
                let url = res.url();
                console.log("第" + i + "张Url" + url);

                urlArr.push(url);
                j++;
                console.log(j, imgLength);
                if (imgLength == j) {
                  console.log("完成" + imgLength, urlArr);
                  resolve(urlArr)

                }

              }, function (error) {
                console.log(error)
              });

            }
          }








        })
      }















      asyncFunc1().then(function (urllist) {

        var Diary = Bmob.Object.extend("demand");
        var query = new Diary();
        query.set("user_objectid", wx.getStorageSync('user_id'))
        query.set("collectNum", 0)
        query.set("g_name", e.detail.value.name)
        query.set("d_type", 1)
        query.set("head_pic_url", urllist[0])
        query.set("price", parseInt(e.detail.value.s_price))
        query.set("description", e.detail.value.detail)
        query.set("place", that.data.picker[e.detail.value.schoolarea])
        query.set("g_type", that.data.picker1[e.detail.value.sort])
        query.set("wechat", e.detail.value.wechat_number)
        query.set("mobilePhoneNumber", e.detail.value.phone_number)
        //query.set("cost", parseInt(e.detail.value.o_price))
        query.save(null, {
          success: function (result) {
            // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
            console.log("日记创建成功, d_num:" + result.id);

            var photo = Bmob.Object.extend("good_pic");
            var photo1 = new photo();
            photo1.set("owner_objid", wx.getStorageSync('user_id'))
            photo1.set("all_pic_url", urllist)
            photo1.set("d_type", 1)
            photo1.set("d_objid", result.id)

            photo1.save(null, {
              success: function (result) {
                // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                console.log("图片创建成功, objectId:" + result.id);
                wx.hideLoading()
                wx.redirectTo({
                  url: '../want_ok/want_ok'
                })







              },
              error: function (result, error) {
                // 添加失败
                console.log('创建图片失败' + JSON.stringify(result) + JSON.stringify(error));

              }
            })






          },
          error: function (result, error) {
            // 添加失败
            console.log('创建日记失败' + JSON.stringify(result) + JSON.stringify(error));

          }
        })







      })



    } else {

      this.setData({
        modalName: 'bottomModal'
      })
    }










  },
  hideModal(e) {
    this.setData({
      modalName: null,
      modalName_phone:null
    })
  },


  upImg: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showNavigationBarLoading()
        that.setData({
          loading: false
        })
        var urlArr = new Array();
        // var urlArr={};
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        var imgLength = tempFilePaths.length;
        if (imgLength > 0) {
          var newDate = new Date();
          var newDateStr = newDate.toLocaleDateString();

          var j = 0;
          //如果想顺序变更，可以for (var i = imgLength; i > 0; i--)
          for (var i = 0; i < imgLength; i++) {
            var tempFilePath = [tempFilePaths[i]];
            var extension = /\.([^.]*)$/.exec(tempFilePath[0]);
            if (extension) {
              extension = extension[1].toLowerCase();
            }
            var name = newDateStr + "." + extension;//上传的图片的别名

            var file = new Bmob.File(name, tempFilePath);
            file.save().then(function (res) {
              wx.hideNavigationBarLoading()
              var url = res.url();
              console.log("第" + i + "张Url" + url);

              urlArr.push({ "url": url });
              j++;
              console.log(j, imgLength);
              // if (imgLength == j) {
              //   console.log(imgLength, urlArr);
              //如果担心网络延时问题，可以去掉这几行注释，就是全部上传完成后显示。
              showPic(urlArr, that)
              // }

            }, function (error) {
              console.log(error)
            });

          }




        }

      }
    })
  },
  back() {
    wx.switchTab({
      url: '../fabu/fabu',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  setphonenumber() {
    var that = this;
    wx.getStorage({
      key: 'my_phonenumber',
      success: function (res) {

        that.setData({

          number: res.data

        })



      },
      fail: function (error) {
        that.setData({
          modalName_phone: 'Modal'
        })

      }
    })

  },
  setwechatnumber() {
    var that = this;
    wx.getStorage({
      key: 'my_wechatnumber',
      success: function (res) {

        that.setData({

          wechat_number: res.data

        })



      },
      fail: function (error) {
        that.setData({
          modalName_phone: 'Modal'
        })

      }
    })

  }





  //上传完成后显示图片

})
