// pages/login/login.js
//获取应用实例
const storage =  require("../../utils/storage");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',//获取的token

    code:'',
    username: '',
    password: ''
  },
  
  // login:function () {
  //   wx.reLaunch({
  //     url: '../index/index',
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let code = wx.getStorageSync('code');
    // let that = this 
    // that.setData({code:code})
    // console.log(code,'00000000000000000');
  },
   // 获取输入账号 
   usernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
 
  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 登录处理
  login: function () {
    var that = this;
    if (this.data.username.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '账号或密码不能为空',
        icon: 'none',
        duration: 1500
      })
    } else {
      wx.showLoading({
        title: '请等待...',
      })
      
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log(res.code,'绑定账号的code')
          // wx.setStorageSync('code', res.code)
          let code = res.code
          console.log(code,'99999');
          //发起网络请求
          // var that =this
          wx.request({
            url:'https://ht.energytwin.com/weixin/login/', // 仅为示例，并非真实的接口地址
            method: 'post',
            data: {
              code: code,
              username: that.data.username,
              password: that.data.password
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success(res) {
              wx.hideLoading();
              console.log(res,'9999999999999');
              if (res.data.success == true) {

                let token = res.data.data.token;
                storage.set_token(token)

                wx.setStorageSync('name', res.data.data.username)
                wx.setStorageSync('mobile', res.data.data.mobile)

                wx.reLaunch({
                  url: '../index/index',
                })
                wx.showToast({
                  title: '绑定成功',
                  icon: 'success',
                  duration: 1500//持续的时间
                })
              } else {
                wx.showToast({
                  title: '账号密码有误',
                  icon: 'loading',
                  duration: 1500
                })
              }
            }
          })

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    
  }

  },

  // 登录处理
  fang: function () {
    var that = this;
    if (this.data.username.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '账号或密码不能为空',
        icon: 'none',
        duration: 1500
      })
    } else {
      wx.showLoading({
        title: '请等待...',
      })
      
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log(res.code,'绑定账号的code')
          // wx.setStorageSync('code', res.code)
          let code = res.code
          console.log(code,'99999');
          //发起网络请求
          // var that =this
          wx.request({
            url:'https://ht.energytwin.com/authorizations/', // 仅为示例，并非真实的接口地址
            method: 'post',
            data: {
              code: code,
              username: that.data.username,
              password: that.data.password
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success(res) {
              wx.hideLoading();
              console.log(res,'9999999999999');
              if (res.data.success == true) {

                let token = res.data.data.token;
                storage.set_token(token)

                wx.setStorageSync('name', res.data.data.username)
                wx.setStorageSync('mobile', res.data.data.mobile)

                wx.reLaunch({
                  url: '../index/index',
                })
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 1500//持续的时间
                })
              } else {
                wx.showToast({
                  title: '账号密码有误',
                  icon: 'loading',
                  duration: 1500
                })
              }
            }
          })

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    
  }

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
    // const token  = storage.get_token()
    // var that = this 
    // that.setData({token:token})
    // // console.log(token,'000000');
    // if (!token) {
    //   wx.reLaunch({
    //     url: '../indexs/indexs',
    //   })
    // }
    const token  = storage.get_token()
    var that = this 
    that.setData({token:token})
    // console.log(token,'000000');
    if (token) {
      wx.reLaunch({
        url: '../index/index',
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