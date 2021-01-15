// pages/my/users.js
const storage = require("../../utils/storage");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '', //获取的token
    username: '',
  },
  // 获取公司名称 
  usernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  // 登录处理
  login: function () {
    const that = this
    const token = that.data.token
    if (this.data.username.length == 0) {
      wx.showToast({
        title: '不能输入空字符',
        icon: 'none',
        duration: 1500
      })
    } else {
      wx.request({
        url: 'https://ht.energytwin.com/my_user_info', // 仅为示例，并非真实的接口地址
        method: 'put',
        data: {
          company: that.data.username,
        },
        header: {
          'content-type': 'application/json', // 默认值
          'Authorization': `JWT ${token}`
        },
        success: function (res) {
          console.log(res, '9999999999999');
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 1500 //持续的时间
          })
          wx.setStorageSync('company', res.data.data.company)
        }
      })
    }
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
    const token = storage.get_token()
    var that = this
    that.setData({
      token: token
    })
    // console.log(token,'000000');
    if (!token) {
      wx.reLaunch({
        url: '../indexs/indexs',
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