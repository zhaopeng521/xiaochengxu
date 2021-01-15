// pages/my/email.js
const storage =  require("../../utils/storage");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '', //获取的token
    email: '',
  },
  // 获取email名称 
  emailInput: function (e) {
    this.setData({
      email: e.detail.value
    })
  },
  // 登录处理
  login: function () {
    const that = this
    const token = that.data.token
    if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.data.email)) || that.data.email.length == 0) {
      wx.showToast({
        title: '邮箱输入有误',
        icon: 'none',
        duration: 1500
      })
    } else {
      wx.request({
        url: 'https://ht.energytwin.com/my_user_info', // 仅为示例，并非真实的接口地址
        method: 'put',
        data: {
          email: that.data.email,
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
    const token  = storage.get_token()
    var that = this 
    that.setData({token:token})
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