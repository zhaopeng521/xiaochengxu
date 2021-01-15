// pages/my/my.js
//获取应用实例
const app = getApp()
const storage =  require("../../utils/storage");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',//获取的token
    name:'',//获取的用户名
    mobile:'',//获取的手机号

    // 模拟登陆开始
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
    // 模拟登陆结束

    nickName:'',
    avatarUrl:''
  },
  xinxi:function () {
    wx.navigateTo({
      url: '../my/information',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let nickName = wx.getStorageSync('nickName');
    this.setData({nickName:nickName})
    let avatarUrl = wx.getStorageSync('avatarUrl');
    this.setData({avatarUrl:avatarUrl})
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }

  },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  //   wx.login({
  //     success:(res) =>{
  //       if (res.code) {
  //         console.log(res)
  //         //发起网络请求
  //         var that =this
  //         wx.request({
  //           url: 'http://52.80.250.134:3005/mock/15/weixin/login/',
  //           method: "GET",
  //           data: {
  //             code:res.code,
  //             // nickName: app.globalData.userInfo.nickName,
  //             // avatarUrl: app.globalData.userInfo.avatarUrl,
  //             // gender: app.globalData.userInfo.gender
  //           },
  //           success(res){
  //             // that.data.userId = res.data
  //             // wx.setStorage({
  //             //   key: 'userId',
  //             //   data: that.data.userId,
  //             // })
  //             console.log(res.data,'9999999999')
  //           }
  //         })
  //       } else {
  //         console.log('登录失败！' + res.errMsg)
  //       }
  //     }
  //   })
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
    if (!token) {
      wx.reLaunch({
        url: '../indexs/indexs',
      })
    }
    const name  =  wx.getStorageSync('name');
    that.setData({name:name})
    const mobile  =  wx.getStorageSync('mobile');
    that.setData({mobile:mobile})
    // that.getname() //获取用户信息
  },
  tui:function () {
    const that = this
    const token = that.data.token
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log(res.code,'退出登录的code')
          let code = res.code
          //发起网络请求
          // var that =this
          wx.request({
            url:'https://ht.energytwin.com/remove_bind/', // 仅为示例，并非真实的接口地址
            method: 'DELETE',
            data: {
              code: code,
            },
            header: {
              'content-type': 'application/json', // 默认值
              'Authorization': `JWT ${token}`
            },
            success:function(res) {
              console.log(res,'9999999999999');
              if (res.data.success == true) {
                wx.clearStorageSync()
                wx.reLaunch({
                  url: '../indexs/indexs',
                })
                wx.showToast({
                  title: '退出成功',
                  icon: 'success',
                  duration: 1500//持续的时间
                })
              }
            }
          })
        } else {
          console.log('退出登录失败！' + res.errMsg)
        }
      }
    })
  },
  
  // jie:function () {
  //   const that = this
  //   const token = that.data.token
  //   wx.login({
  //     success: (res) => {
  //       if (res.code) {
  //         console.log(res.code,'解除绑定账号的code')
  //         let code = res.code
  //         //发起网络请求
  //         // var that =this
  //         wx.request({
  //           url:'https://ht.energytwin.com/remove_bind/', // 仅为示例，并非真实的接口地址
  //           method: 'DELETE',
  //           data: {
  //             code: code,
  //           },
  //           header: {
  //             'content-type': 'application/json', // 默认值
  //             'Authorization': `JWT ${token}`
  //           },
  //           success:function(res) {
  //             console.log(res,'9999999999999');
  //             if (res.data.success == true) {
  //               wx.clearStorageSync()
  //               wx.reLaunch({
  //                 url: '../indexs/indexs',
  //               })
  //               wx.showToast({
  //                 title: '解绑成功',
  //                 icon: 'success',
  //                 duration: 1500//持续的时间
  //               })
  //             }
  //           }
  //         })
  //       } else {
  //         console.log('解绑失败！' + res.errMsg)
  //       }
  //     }
  //   })

  // },

  // 获取用户信息
  // getname(){
  //   const that = this
  //   const token = that.data.token
  //   wx.request({
  //     url: 'http://54.223.91.160:8888/user/userinfo/',
  //     method: 'get',
  //     data: {},
  //     header: {
  //       'content-type': 'application/json', // 默认值
  //       'Authorization': `JWT ${token}`
  //     },
  //     success: function(res){
  //       console.log(res,'获取用户信息999999');
  //       that.setData({
  //         // arrgy : res.data.data
  //       })
  //     }
  //   })
  // },

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