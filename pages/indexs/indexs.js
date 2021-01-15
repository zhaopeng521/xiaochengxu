// pages/indexs/indexs.js
//获取应用实例
const storage =  require("../../utils/storage");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that = this;
    // // 查看是否授权
    // wx.getSetting({
    //     success: function(res) {
    //         if (res.authSetting['scope.userInfo']) {
    //             wx.getUserInfo({
    //                 success: function(res) {
    //                     // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
    //                     // 根据自己的需求有其他操作再补充
    //                     // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
    //                     wx.login({
    //                         success: res => {
    //                             // 获取到用户的 code 之后：res.code
    //                             console.log("用户的code:" + res.code);                       
    //                             let code = res.code;
    //                             wx.setStorageSync('code', code);
    //                             console.log(code,'666666666666666');
    //                             // 可以传给后台，再经过解析获取用户的 openid
    //                             // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
    //                             // wx.request({
    //                             //     // 自行补上自己的 APPID 和 SECRET
    //                             //     url: 'https://api.weixin.qq.com/sns/jscode2session?appid=自己的APPID&secret=自己的SECRET&js_code=' + res.code + '&grant_type=authorization_code',
    //                             //     success: res => {
    //                             //         // 获取到用户的 openid
    //                             //         console.log("用户的openid:" + res.data.openid);
    //                             //     }
    //                             // });
    //                         }
    //                     });
    //                 }
    //             });
    //         } else {
    //             // 用户没有授权
    //             // 改变 isHide 的值，显示授权页面
    //             that.setData({
    //                 isHide: true
    //             });
    //         }
    //     }
    // });




    // var that = this
    

  },

  //   bindGetUserInfo: function(e) {
  //     if (e.detail.userInfo) {
  //         //用户按了允许授权按钮
  //         var that = this;
  //         // 获取到用户的信息了，打印到控制台上看下
  //         console.log("用户的信息如下：");
  //         console.log(e.detail.userInfo);
  //         var nickName = e.detail.userInfo.nickName;
  //         var avatarUrl = e.detail.userInfo.avatarUrl;
  //         wx.setStorageSync('nickName', nickName);
  //         wx.setStorageSync('avatarUrl', avatarUrl);
  //         //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
  //         that.setData({
  //             isHide: false
  //         });
  //         wx.reLaunch({
  //           url: '../index/index',
  //         })
  //     } else {
  //         //用户按了拒绝按钮
  //         wx.showModal({
  //             title: '警告',
  //             content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
  //             showCancel: false,
  //             confirmText: '返回授权',
  //             success: function(res) {
  //                 // 用户没有授权成功，不需要改变 isHide 的值
  //                 if (res.confirm) {
  //                     console.log('用户点击了“返回授权”');
  //                 }
  //             }
  //         });
  //     }
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const token  = storage.get_token()
    var that = this 
    that.setData({token:token})
    // console.log(token,'000000');
    if (token) {
      wx.reLaunch({
        url: '../index/index',
      })
    }else{
      // 判断用户是否授权登录
    wx.getSetting({
      success: function (res) {
        // 判断是否授权
        if (res.authSetting['scope.userInfo']) {
          //获取用户信息
          wx.getUserInfo({
            success: function (res) {
              console.log(res, '4444444444444444444');
              //用户已经授权过，添加用户信息
              // // var that = this
              // wx.setStorageSync('nickName', res.userInfo.nickName)
              // wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
            }
          });
        } else {
          wx.showModal({
            title: '欢迎进入航天小程序',
            content: '是否进入小程序',
            // cancelText: '取消登录',
            confirmText: '确定',
            success: function (res) {
              console.log(res, '333333333333333333');
              if (res.cancel) {
                //这个跳转是左边按钮的跳转链接
                //用户按了拒绝按钮
                wx.showModal({
                  title: '警告', 
                  content: '您点击了不同意，将无法进入小程序，请同意之后再进入!!!',
                  showCancel: false,
                  confirmText: '返回同意',
                  success: function (res) {
                    // 用户没有授权成功，不需要改变 isHide 的值
                    if (res.confirm) {
                      wx.reLaunch({
                        url: '../indexs/indexs'
                      })
                    }
                  }
                });

              } else {
                //这里是右边按钮的跳转链接
                wx.login({
                  success: (res) => {
                    if (res.code) {
                      console.log(res.code,'判断状态的code')
                      // wx.setStorageSync('code', res.code)
                      //发起网络请求
                      // var that =this
                      wx.request({
                        url: 'https://ht.energytwin.com/weixin/login/',
                        method: "GET",
                        data: {
                          code: res.code,
                        },
                        success(res) {
                          console.log(res, '登录成功9999999999')
                          // if (res.data.data.login === undefined) {
                          if (!res.data.data.login) { 
                            let token = res.data.data.token;
                            storage.set_token(token)
                            wx.setStorageSync('name', res.data.data.username)
                            wx.setStorageSync('mobile', res.data.data.mobile)
                            // wx.reLaunch({
                            //   url: '../index/index',
                            // })
                            wx.showModal({
                              title: '提示',
                              content: '成功',
                              showCancel: false,
                              confirmText: '确定',
                              success: function (res) {
                                console.log(res,'跳转首页0000000000000000000');
                                // 用户没有授权成功，不需要改变 isHide 的值
                                // if (res.confirm) {
                                  wx.reLaunch({
                                    url: '../login/login',
                                  })
                                // }
                              }
                            });

                          } else if (res.data.data.login === undefined){
                            wx.showModal({
                              title: '提示',
                              content: '成功',
                              showCancel: false,
                              confirmText: '确定',
                              success: function (res) {
                                console.log(res,'跳转至绑定账号页面0000000000000000000');
                                // 用户没有授权成功，不需要改变 isHide 的值
                                // if (res.confirm) {
                                  wx.reLaunch({
                                    url: '../index/index',
                                  })
                                // }
                              }
                            });

                          }                     
                        }
                      })
                    } else {
                      console.log('登录失败！' + res.errMsg)
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
    }
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

  }
})