// pages/alarm/alarm.js
//获取应用实例
const app = getApp()
const storage = require("../../utils/storage");
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '', //获取的token
    dataList1: '', //获取的告警列表
    realTime:null,//实时数据对象(用于关闭实时刷新方法)

    status: 0, //设备状态
    device: '', //设备id
    group:-1,//项目id

    date: '', //默认起始时间  
    date2: '', //默认结束时间


    pic_array:[],//组件下拉框项目内容
    hx_index: 0,//组件下拉框
    id1:'',//项目id

    pic_array2:[],//组件下拉框设备内容
    hx_index2: 0,//组件下拉框
    id2:'',//设备id

    pic_array3:[  //组件下拉框设备内容
      {
        id: '0',
        name: '未处理'
      },
      {
        id: '1',
        name: '处理中'
      }, 
      {
        id: '2',
        name: '已处理'
      }
    ],//组件下拉框设备下点位内容

    hx_index3: 0,//组件下拉框
    id3:'',//点位id


    showView: true, //去处理遮罩
    showall: true, //处理完成遮罩



    // selected: {},
    all_roles: '', //访客权限
    hiddenName: false,


    startTimes: '',
    endTimes:'',


    // 选项卡
    // selected: true,
    // selecte: false,
  },
  initDate() {
    let date2 = new Date()
    this.setData({
      date: this.formatTime2(date2),
      date2: this.formatTime2(date2)
    })
  },
  formatTime3(string) {
    let date = string.substring(0, 10);
    date = date.replace(/-/g, '/');
    var timestamp = new Date(date).getTime()/1000;
    return timestamp
  },
  formatTime2(time) {
    const d = new Date(time)
    let batchTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    return batchTime
  },
  formatTime(time) {
    const d = new Date(time)
    let batchTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    return batchTime
  },

  // 时间段选择  
  bindDateChange(e) {
    // let that = this;
    // // console.log(e.detail.value)
    // that.setData({
    //   date: e.detail.value,
    // })
    let that = this;
    console.log(e.detail.value,'开始时间')
    var startTime=Math.round(new Date(e.detail.value).getTime()/1000)
    that.setData({
      date: e.detail.value,
      startTimes: startTime
    })
  },
  bindDateChange2(e) {
    // let that = this;
    // that.setData({
    //   date2: e.detail.value,
    // })
    let that = this;
    console.log(e.detail.value,'结束时间')
    var endTime=Math.round(new Date(e.detail.value).getTime()/1000)
    that.setData({
      date2: e.detail.value,
      endTimes: endTime
    })
  },
  // 搜索数据
  sousuo: function () {
    const that = this
    const token = that.data.token
    const group = that.data.group
    const device = that.data.device
    const status = that.data.status
    wx.request({
      url: 'https://ht.energytwin.com/alarm/',
      method: 'get',
      data: {
        group: group,
        device: device,
        status: status,
        start: that.data.startTimes,
        end: that.data.endTimes
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `JWT ${token}`
      },
      success: function (res) {
        console.log(res, '告警搜索列表55555555555555');
        that.setData({
          dataList1: res.data.data, //在线
        })
      }
    })
  },

  //下拉框项目分组下所有项目
  getList2(){
    const that = this
    const token = that.data.token
    wx.request({
      url: 'https://ht.energytwin.com/mini_groups/',
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `JWT ${token}`
      },
      success: function(res){ 
        let pic_array = res.data.data
        pic_array.unshift({'id':-1,'name':'全部',})
        that.setData({
          pic_array : res.data.data//获取当前用户所有的项目分组
        })
        console.log(pic_array,'当前用户所有的项目分组999999');
      }
    })
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
    // 项目下拉框
    bindPickerChange_hx: function (e) {
      const that = this
      const token = that.data.token
      // console.log('项目名:', e.target.dataset.selecthxpicker);
      // console.log('项目id:', e.target.dataset.id);
  
      console.log('项目名:', this.data.pic_array[e.detail.value].name);
      console.log('项目id:', this.data.pic_array[e.detail.value].id);
      that.setData({   //给变量赋值
        // id1:e.target.dataset.id,//项目的id
        group:this.data.pic_array[e.detail.value].id,//项目的id
        hx_index : e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
     })
      console.log('自定义下标:', that.data.hx_index);
      const group = that.data.group
      wx.request({
        url: 'https://ht.energytwin.com/mini_devices/',
        method: 'post',
        data: {
          group: group,
        },
        header: {
          'content-type': 'application/json', // 默认值
          'Authorization': `JWT ${token}`
        },
        success: function(res){
          console.log(res.data.data,'分组下所有设备999999');
          let pagedata = res.data.data
          that.setData({
            pic_array2 : pagedata,
          })
        }
      })
    },


    // 设备下拉框
    bindPickerChange_hx2: function (e) {
      const that = this
      // console.log('设备名:', e.target.dataset.selecthxpicker);
      // console.log('设备id:', e.target.dataset.id);
      console.log('设备名:', this.data.pic_array2[e.detail.value].name);
      console.log('设备id:', this.data.pic_array2[e.detail.value].id);
      that.setData({   //给变量赋值
        device: this.data.pic_array2[e.detail.value].id,//设备的id
        hx_index2 : e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
     })
      console.log('自定义下标:', that.data.hx_index2);
    },
  
    // 状态下拉框
    bindPickerChange_hx3: function (e) {
      let that = this
      console.log('点位名:', this.data.pic_array3[e.detail.value].name);
      console.log('点位id:', this.data.pic_array3[e.detail.value].id);
      that.setData({   //给变量赋值
        status:this.data.pic_array3[e.detail.value].id,//点位的id
        hx_index3 : e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
     })
      console.log('自定义下标:', that.data.hx_index3);
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
    if (!token) {
      wx.reLaunch({
        url: '../indexs/indexs',
      })
    }

    this.data.realTime = setInterval(function(){
      // 请求服务器数据
      that.getList();
      that.getList2();
      that.initDate();
      // 反馈提示
      // wx.showToast({
      //   title: '数据已更新！'
      // })

    }, 60000)//间隔时间

    // 更新数据
    this.setData({
      realTime:this.data.realTime,//实时数据对象(用于关闭实时刷新方法)
    })

    that.getList();
    that.getList2();
    that.initDate();
    const all_roles = wx.getStorageSync('all_roles');
    that.setData({
      all_roles: all_roles
    })
    if (all_roles.length === 1 && all_roles[0] === "访客") {
      wx.showModal({
        title: '提示',
        content: '您需要更高权限才可浏览',
        success(res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '../index/index',
            })
          } else if (res.cancel) {
            wx.reLaunch({
              url: '../index/index',
            })
          }
        }
      })
    }
  },


  getList() {
    const that = this
    const token = that.data.token
    const status = that.data.status
    const device = that.data.device
    const group = that.data.group
    wx.request({
      url: 'https://ht.energytwin.com/alarm/',
      method: 'get',
      data: {
        group: group,
        status: status,
        device: device
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `JWT ${token}`
      },
      success: function (res) {
        console.log(res, '首页分组下在线和离线设备999999');
        that.setData({
          dataList1: res.data.data, //在线
        })
      }
    })
  },
  // 去处理遮罩
  name: function (e) {
    console.log(e.currentTarget.dataset.item.id, '去处理666');
    this.setData({
      currentItem: e.currentTarget.dataset.item,
      showView: (!this.data.showView),
    })
  },
  // 取消处理遮罩
  userq: function () {
    this.setData({
      showView: (!this.data.showView),
    })
  },
  // 确认处理遮罩
  userque: function () {
    this.delUser()
    this.setData({
      showView: (!this.data.showView),

    })
  },
  // 处理接口
  delUser() {
    console.log('哒哒哒哒');
    const that = this
    const token = that.data.token;
    const group = that.data.group;
    let id = that.data.currentItem.id;
    console.log(id, '99999')
    wx.request({
      //路径和传参替换下，
      url: `https://ht.energytwin.com/alarm/${id}/`,
      method: 'PUT',
      data: {
        group: group,
        status: 1
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `JWT ${token}`
      },
      success: function (res) {
        wx.showToast({
          title: '等待处理完成',
          duration: 2000
        })
        that.getList()
      }
    })
  },

  // 处理完成遮罩
  name2: function (e) {
    console.log(e.currentTarget.dataset.item.id, '去处理666');
    this.setData({
      currentItem: e.currentTarget.dataset.item,
      showall: (!this.data.showall),
    })
  },
  // 取消处理完成遮罩
  userq2: function () {
    this.setData({
      showall: (!this.data.showall),
    })
  },
  // 确认处理完成遮罩
  userque2: function () {
    const that = this
    const token = that.data.token;
    const group = that.data.group;
    let id = that.data.currentItem.id;
    console.log(id, '99999')
    wx.request({
      //路径和传参替换下，
      url: `https://ht.energytwin.com/alarm/${id}/`,
      method: 'PUT',
      data: {
        group: group,
        status: 2
        
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `JWT ${token}`
      },
      success: function (res) {
        wx.showToast({
          title: '处理完成',
          duration: 2000
        })
        that.getList()
      },
      fail: function (res) {

        console.log(res, '请求数据失败');

      }
    })
    console.log(id, '99999111111')
    that.setData({
      showall: (!that.data.showall),

    })
  },
  // 处理完成接口
  delUser2() {
    console.log('哒哒哒哒');

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.realTime)
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
        let that = this;
    　  wx.showNavigationBarLoading()  //在标题栏中显示加载
        that.getList();
        that.getList2();
        that.initDate();  //重新加载数据
    　　//模拟加载  1秒
    　　setTimeout(function () {
    　　　// complete
    　　　wx.hideNavigationBarLoading() //完成停止加载
    　　　wx.stopPullDownRefresh() //停止下拉刷新
    　　}, 1000);
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