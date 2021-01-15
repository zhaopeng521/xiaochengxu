// pages/historicaldata/historicaldata.js
//获取应用实例
const app = getApp();

//首先引入wxcharts.js插件
var wxCharts = require("../../utils/wxcharts.js");

//定义记录初始屏幕宽度比例，便于初始化
var windowW = 0;

const storage = require("../../utils/storage");

const util = require('../../utils/util.js');

const {echarts} = requirePlugin('echarts');

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // ec: {lazyLoad: true},// 将 lazyLoad 设为 true 后，需要手动初始化图表


    names: null,
    names2: null,



    arr:[],
    token: '', //获取的token
    
    pic_array:[],//组件下拉框项目内容
    hx_index: 0,//组件下拉框
    id1:'',//项目id

    pic_array2:[],//组件下拉框设备内容
    hx_index2: 0,//组件下拉框
    device_num:'',
    id2:'',//设备id

    pic_array3:[],//组件下拉框设备下点位内容
    hx_index3: 0,//组件下拉框
    id3:'',//点位id

    tsData:[],//图表

    // option:{},


    // selected: {},
    all_roles: '', //访客权限
    hiddenName: false,



    date: new  Date().getTime(), //默认起始时间  
    date2: '', //默认结束时间

    dates1:'',//转换的开始十位时间戳
    dates2:'',//转换的结束十位时间戳  

    startTimes: new Date().getTime() - 3600 * 1000 * 24 * 7,
    endTimes:new Date().getTime(),


    option:{
      //折线图标题
      // title: {
      //   text: '',
      //   left: 'center',
      //   top:'15'
      // },
      // 折线图线条的颜色
      // color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
      tooltip: {
        show: true,
        trigger: 'axis',
      },
      legend: {
        data: [],
        top: 18,
        left: 'center',
        z: 100
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
      },
      yAxis: {
        type: 'value',
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
      }, {
        start: 0,
        end: 10,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
      series: [{
          data: [],
          type: 'line',
          smooth: true,
          symbol: 'none',
          name:''
        },
      ]
    }

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
    let that = this;
    console.log(e.detail.value,'开始时间')
    let stt = e.detail.value+' '+'00:00:01'
    var startTime=new Date(stt).getTime()
    that.setData({
      date: e.detail.value,
      startTimes: startTime
    })
  },
  bindDateChange2(e) {
    let that = this;
    console.log('rrrrrrrrrrrrrrrrrrrrrrr',e.detail.value)
    let endT = e.detail.value+' '+'23:59:59';
    let endTime= new Date(endT).getTime()
    that.setData({
      date2: e.detail.value,
      endTimes: endTime
    })
  },
  // 搜索数据
  sousuo: function () {
    const that = this
    const token = that.data.token
    const id = that.data.id2 || that.data.pic_array2[0].id
    const id3 = that.data.id3 || that.data.pic_array3[0].id;
    wx.showLoading({
      title: '正在搜索数据...',
    })
    that.setData({
      arr: []
    })
    wx.request({
      url: 'https://ht.energytwin.com/mini_history/',
      data: {
        device: id,
        points: [
          id3
        ],
        start: parseInt(that.data.startTimes/1000),
        end: parseInt(that.data.endTimes/1000),
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `JWT ${token}`
      },
      method: 'POST',
      success: function (res) {
        var arr=[]
        var arr1=[]
        for(var i=0; i<res.data.data.length; i++) {
          arr.push(res.data.data[i][id3])
          arr1.push(that.formatTime(res.data.data[i]['timestamp'] * 1000))
        }
        let value1 = 'option.series[0].data'
        let value = 'option.xAxis.data'
        let value2 = 'option.series[0].name'
        let value3 = 'option.legend.data[0]'
        let tt=that.data.names2
        that.setData({
          [value1]: arr,
          [value]: arr1,
          [value2]: tt,
          [value3]: tt
        })
        const tsData = res.data.data.map(item => {
          return {
            ...item,
            timestamp: that.formatTime(item.timestamp * 1000)
          }
        })
        let totalData = tsData.slice(0, 20).concat(tsData.slice(tsData.length - 20, tsData.length - 1))
        wx.hideLoading()
        that.setData({
          tsData: totalData,
          arr: that.data.arr.concat(res.data.data)
        })
      },
    })
  },


  // 项目下拉框
  bindPickerChange_hx: function (e) {
    const that = this
    const token = that.data.token
    // const token = that.data.token;
    // console.log('项目名:', e.target.dataset.selecthxpicker);
    // console.log('项目id:', e.target.dataset.id);

    console.log('项目名:', this.data.pic_array[e.detail.value].name);
    console.log('项目id:', this.data.pic_array[e.detail.value].id);
    that.setData({   //给变量赋值
      // id1:e.target.dataset.id,//项目的id
      id1:this.data.pic_array[e.detail.value].id,//项目的id
      hx_index : e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
   })
    console.log('自定义下标:', that.data.hx_index);
    const group = that.data.id1;
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
        let pagedata = res.data.data;
        pagedata.forEach(el => {
          el['name_ny'] = el.name+"_"+el.device_num;
        });
        console.log(pagedata,'pagedata')
        that.setData({
          pic_array2 : pagedata,
        })
      }
    })
  },

  // 设备下拉框
  bindPickerChange_hx2: function (e) {
    const that = this
    const token = that.data.token
    console.log('设备名:', this.data.pic_array2[e.detail.value].name);
    console.log('设备编号:', this.data.pic_array2[e.detail.value].device_num);
    console.log('设备id:', this.data.pic_array2[e.detail.value].id);
    let device_num = this.data.pic_array2[e.detail.value].name.concat(this.data.pic_array2[e.detail.value].device_num)
    console.log(device_num,'设备名+设备编号');
    

    that.setData({   //给变量赋值
      id2: this.data.pic_array2[e.detail.value].id,//设备的id
      name:this.data.pic_array2[e.detail.value].name, //设备名
      device_num: this.data.pic_array2[e.detail.value].device_num,//设备的编号
      hx_index2 : e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
   })
   
    console.log('自定义下标:', that.data.hx_index2);
    const id = that.data.id2
    wx.showLoading({
      title: '数据加载中...',
    })
    wx.request({
      url: `https://ht.energytwin.com/mini_device_points/${id}/`,
      data: {},
      method: 'get',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `JWT ${token}`
      },
      success: function(res){
        // console.log(res.data.data,'当前项目分组设备下所有点位999999');
        that.setData({
          pic_array3 : res.data.data//获取当前用户所有的项目分组
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      }
    })
  },

  // 点位下拉框
  bindPickerChange_hx3: function (e) {
    // console.log(4444,e.detail.value,this.data.pic_array3)
    // console.log(6666,this.data.pic_array3[e.detail.value].id);
    let that = this
    console.log('点位名:', this.data.pic_array3[e.detail.value].name);
    console.log('点位id:', this.data.pic_array3[e.detail.value].id);
    that.setData({   //给变量赋值
      names: this.data.pic_array3[e.detail.value].id,
      names2: this.data.pic_array3[e.detail.value].name,
      id3:this.data.pic_array3[e.detail.value].id,//点位的id
      hx_index3 : e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
   })
    console.log('自定义下标:', that.data.hx_index3);
  },


  // 下拉框项目内容
  getList1(){
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
  //下拉框项目分组下所有设备 + 第一个点位赋值
  getList2(){
    let that = this
    const group = -1;
    const token = that.data.token
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
        let pagedata = res.data.data
        const id_1 = pagedata[0].id;
        pagedata.forEach(el => {
          el['name_ny'] = el.name+"_"+el.device_num;
        });
        that.setData({
          pic_array2 : pagedata,
        })
        wx.request({ //第一个点位
          url: `https://ht.energytwin.com/mini_device_points/${id_1}/`,
          method: 'get',
          header: {
            'content-type': 'application/json', // 默认值
            'Authorization': `JWT ${token}`
          },
          success: function(res){
            that.setData({
              pic_array3 : res.data.data//获取当前用户所有的项目分组
            })
            that.getMap()
          }
        })
      }
    })
  },
getMap(){
  const that = this
    const token = that.data.token
    const id = that.data.id2 || that.data.pic_array2[0].id
    const id3 = that.data.id3 || that.data.pic_array3[0].id;
    wx.showLoading({
      title: '正在搜索数据...',
    })
    that.setData({
      arr: []
    })
    wx.request({
      url: 'https://ht.energytwin.com/mini_history/',
      data: {
        device: id,
        points: [
          id3
        ]
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `JWT ${token}`
      },
      method: 'POST',
      success: function (res) {
        var arr=[]
        var arr1=[]
        for(var i=0; i<res.data.data.length; i++) {
          arr.push(res.data.data[i][id3])
          arr1.push(that.formatTime(res.data.data[i]['timestamp'] * 1000))
        }
        let value1 = 'option.series[0].data'
        let value = 'option.xAxis.data'
        let value2 = 'option.series[0].name'
        let value3 = 'option.legend.data[0]'
        let tt=that.data.names2
        that.setData({
          [value1]: arr,
          [value]: arr1,
          [value2]: tt,
          [value3]: tt
        })
        const tsData = res.data.data.map(item => {
          return {
            ...item,
            timestamp: that.formatTime(item.timestamp * 1000)
          }
        })
        let totalData = tsData.slice(0, 20).concat(tsData.slice(tsData.length - 20, tsData.length - 1))
        wx.hideLoading()
        that.setData({
          tsData: totalData,
          arr: that.data.arr.concat(res.data.data)
        })
      },
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 屏幕宽度
    this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth
    });
    // console.log(this.data.imageWidth);

    //计算屏幕宽度比列
    windowW = this.data.imageWidth / 375;
    // console.log(windowW);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 获取组件
    // this.ecComponent = this.selectComponent('#mychart-dom-bar');
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
    that.getList1();//项目
    that.getList2();//设备
    that.initDate();

    const all_roles = wx.getStorageSync('all_roles');
    that.setData({
      all_roles: all_roles
    })
    if (all_roles.length === 1 && all_roles[0] === "访客") {
      hiddenName: !this.data.hiddenName
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
    let that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.getList1();//项目
    that.initDate(); //重新加载数据
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