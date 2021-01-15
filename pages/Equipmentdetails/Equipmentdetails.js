// pages/airTerminal/airTerminal.js
const app = getApp()
const storage = require("../../utils/storage");
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realTime: null, //实时数据对象(用于关闭实时刷新方法)
    token: '', //获取的token
    // arrgy: '', //设备总数
    arrgy1: '', //在线设备总数
    arrgy2: '', //离线设备总数

    group: -1, //项目id
    searchValue:'',
    arrgy: [],
    allArr:[],
    newArray: [], //运行设备总数
    newArray2: [], //离线设备总数
    newArray3: [], //故障设备总数
    newArray4: [], //待机设备总数
    newArray5: [], //在线设备总数

    hiddenName1: false, //运行
    hiddenName2: false, //离线
    hiddenName3: false, //故障
    hiddenName4: false, //待机

    selected: true, //全部
    selecte: false, //运行
    selec: false, //待机
    sele: false, //故障
    sel: false, //离线

    uhide: 0,




    tabTxt: ['设备类型'], //分类
    tab: [true],

    pinpai_id: 0, //设备类型
    pinpai_txt: '',

    pic_array: [], //组件下拉框
    hx_index: 0, //组件下拉框
    active_view:'',//跳转后显示具体哪个
    statusColor:{
      运行:'boxs1',
      待机:'boxs4',
      故障:'boxs3',
      离线:'boxs2',
    }
  },
  formatTime(time) {
    const d = new Date(time)
    let batchTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    return batchTime
  },

  // 项目下拉框
  bindPickerChange_hx: function (e) {
    const that = this
    const token = that.data.token
    // console.log('点击选项项目名:', e.target.dataset.selecthx);
    // console.log('点击选项的id:', e.target.dataset.id);
    console.log('项目名:', this.data.pic_array[e.detail.value].name);
    console.log('项目id:', this.data.pic_array[e.detail.value].id);
    that.setData({ //给变量赋值
      group: this.data.pic_array[e.detail.value].id, //项目的id
      hx_index: e.detail.value, //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
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
      success: function (res) {
        console.log(res.data.data, '分组下所有设备999999');
        let pagedata = res.data.data
        that.setData({
          arrgy: pagedata,
          allArr:pagedata
        })
        let newArray = []
        let newArray2 = []
        let newArray3 = []
        let newArray4 = []
        let newArray5 = []
        console.log(222, pagedata);
        pagedata.forEach((now, index) => {
          if (now.status == '运行') {
            newArray.push(now)
          } else if (now.status == '离线') {
            newArray2.push(now)
          } else if (now.status == '故障') {
            newArray3.push(now)
          } else if (now.status == '待机') {
            newArray4.push(now)
          } else if (now.status == '在线') {
            newArray5.push(now)
          }
        })
        that.setData({
          newArray: newArray,
          newArray2: newArray2,
          newArray3: newArray3,
          newArray4: newArray4,
          newArray5: newArray5,
        })
        // console.log(newArray,newArray2,newArray3,newArray4,newArray5,'qqqqqqqq');
      }
    })
  },



  select: function (e) {
    if ('w' == e.currentTarget.dataset.w) {
      this.setData({
        selected: true,
        selecte: false,
        selec: false,
        sele: false,
        sel: false
      })
    } else if ('y' == e.currentTarget.dataset.y) {
      this.setData({
        selected: false,
        selecte: true,
        selec: false,
        sele: false,
        sel: false
      })
    } else if ('z' == e.currentTarget.dataset.z) {
      this.setData({
        selected: false,
        selecte: false,
        selec: true,
        sele: false,
        sel: false
      })
    } else if ('f' == e.currentTarget.dataset.f) {
      this.setData({
        selected: false,
        selecte: false,
        selec: false,
        sele: true,
        sel: false
      })
    } else if ('p' == e.currentTarget.dataset.p) {
      this.setData({
        selected: false,
        selecte: false,
        selec: false,
        sele: false,
        sel: true,
      })
    }
  },

  // 在线
  click1: function (e) {
    this.setData({
      hiddenName2: !this.data.hiddenName2,
      hiddenName3: !this.data.hiddenName3,
      hiddenName4: !this.data.hiddenName4
    })
  },
  // 待机
  click2: function (e) {
    this.setData({
      hiddenName1: !this.data.hiddenName1,
      hiddenName2: !this.data.hiddenName2,
      hiddenName3: !this.data.hiddenName3,
    })
  },
  // 故障
  click3: function (e) {
    console.log(e, '666');
    this.setData({
      hiddenName1: !this.data.hiddenName1,
      hiddenName2: !this.data.hiddenName2,
      hiddenName4: !this.data.hiddenName4,
    })
  },
  // 离线
  click4: function (e) {
    this.setData({
      hiddenName1: !this.data.hiddenName1,
      hiddenName3: !this.data.hiddenName3,
      hiddenName4: !this.data.hiddenName4,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const token = storage.get_token();
    this.setData({
      active_view:options.active_view,
    })
    console.log('9999999999999999999999',this.data.active_view == "运行")
    
    switch(this.data.active_view){
      case '运行' :
        this.setData({
          selected: false, //全部
          selecte: true, //运行
          selec: false, //待机
          sele: false, //故障
          sel: false, //离线
        })
        break;
      case '待机':
          this.setData({
            selected: false, //全部
            selecte: false, //运行
            selec: true, //待机
            sele: false, //故障
            sel: false, //离线
          })
          break;
      case '故障':
            this.setData({
              selected:false , //全部
              selecte: false, //运行
              selec: false, //待机
              sele: true, //故障
              sel: false, //离线
            })
            break;
      case '离线':
              this.setData({
                selected: false, //全部
                selecte: false, //运行
                selec: false, //待机
                sele: false, //故障
                sel: true, //离线
              })
              break;
    }
    
    // let that = this 
    // setInterval(function () {
    //   that.getList1();
    //   that.getList4();
    // }, 1000*60)    //代表1分钟发送一次请求
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
    let that = this
    that.setData({
      token: token,
      searchValue:''
    })
    // console.log(token,'000000');
    if (!token) {
      wx.reLaunch({
        url: '../indexs/indexs',
      })
    }
    that.getList1();
    that.getList4();


    // that.data.realTime = setInterval(function () {
    //   const token = storage.get_token()
    //   let that = this
    //   that.setData({
    //     token: token
    //   })
    //   // console.log(token,'000000');
    //   if (!token) {
    //     wx.reLaunch({
    //       url: '../indexs/indexs',
    //     })
    //   }
    //   // 请求服务器数据
    //   console.log('请求接口：刷新数据')
    //   that.getList1();
    //   that.getList4();
    //   // 反馈提示
    //   // wx.showToast({
    //   //   title: '数据已更新！'
    //   // })

    // }, 60000) //间隔时间

    // 更新数据
    this.setData({
      realTime: this.data.realTime, //实时数据对象(用于关闭实时刷新方法)
    })


  },

  getList1() {
    const that = this
    const token = that.data.token
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
      success: function (res) {
        console.log(res.data.data, '分组下所有设备999999');
        let pagedata = res.data.data;
        that.setData({
          arrgy: pagedata,
          allArr:pagedata
        })
        let newArray = []
        let newArray2 = []
        let newArray3 = []
        let newArray4 = []
        let newArray5 = []
        pagedata.forEach((now, index) => {
          if (now.status == '运行') {
            newArray.push(now)
          } else if (now.status == '离线') {
            newArray2.push(now)
          } else if (now.status == '故障') {
            newArray3.push(now)
          } else if (now.status == '待机') {
            newArray4.push(now)
          } else if (now.status == '在线') {
            newArray5.push(now)
          }
        })
        that.setData({
          newArray: newArray,
          newArray2: newArray2,
          newArray3: newArray3,
          newArray4: newArray4,
          newArray5: newArray5,
        })
      }
    })
  },

  getList4() {
    let that = this
    const token = that.data.token
    wx.request({
      url: 'https://ht.energytwin.com/mini_groups/',
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `JWT ${token}`
      },
      success: function (res) {
        let pic_array = res.data.data
        pic_array.unshift({
          'id': -1,
          'name': '全部',
        })
        that.setData({
          pic_array: res.data.data //获取当前用户所有的项目分组
        })
        console.log(pic_array, '获取当前用户所有的项目分组999999');
      }
    })
  },

  // 点击判断系统跳进详情页
  xiangqing: function (e) {
    const item = e.currentTarget.dataset.item
    console.log(item, '点击判断系统跳进详情页');
    wx.navigateTo({
      url: '/pages/Equipmentdetails/details?item=' + JSON.stringify(item),
    })
  },
// 设备过滤
searchDevices: function(e) {
    
  // 获取输入框当前value值
  let value = e.detail.value;
  let filterArr = this.data.arrgy.filter(el=>{
    let name = el.name;
    let dvs = el.device_num || '';
    return name.includes(value) || dvs.includes(value)
  })
  this.setData({
    selected: true, //全部
    selecte: false, //运行
    selec: false, //待机
    sele: false, //故障
    sel: false, //离线
    allArr:filterArr
  })
},


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('555555555555555555555')
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.getList1();
    that.getList4(); //重新加载数据
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