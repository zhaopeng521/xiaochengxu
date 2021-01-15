// pages/my/passwords.js
const storage =  require("../../utils/storage");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',//获取的token
  },
  // 获取旧密码 
  againPassword: function (e) {
    // console.log(event.detail.value);
    this.setData({
      oldpass: e.detail.value
    })
  },
  // 获取新密码
  oldPassword: function (e) {
    // console.log(event.detail.value);
    this.setData({
      newpass: e.detail.value
    })
  },
  // 获取确认密码 
  newPassword: function (e) {
    // console.log(event.detail.value);
    this.setData({
      checkpass: e.detail.value
    })
  },
  // 确定保存按钮
  phoneque: function () {
    var that = this;
    var token = that.data.token
    if (this.data.oldpass.length == 0 || this.data.newpass.length == 0 || this.data.checkpass.length == 0 || this.data.newpass != this.data.checkpass ) {
      wx.showToast({
        title: '输入有误请重新输入',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url:'https://ht.energytwin.com/my_user_info', // 仅为示例，并非真实的接口地址
        method: 'PUT',
        data: {
          oldPassword: that.data.oldpass,
          newPassword: that.data.newpass,
          againPassword:that.data.checkpass
        },
        header: {
          'content-type': 'application/json', // 默认值
          'Authorization': `JWT ${token}`
        },
        success: function (res) {
          wx.showToast({
              title: '修改密码成功',
              duration: 2000
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