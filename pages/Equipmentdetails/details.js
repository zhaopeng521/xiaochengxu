// pages/Equipmentdetails/details.js
//获取应用实例
const app = getApp();
const storage = require("../../utils/storage");

//首先引入wxcharts.js插件
var wxCharts = require("../../utils/wxcharts.js");

const {echarts} = requirePlugin('echarts');

const util = require('../../utils/util.js');

//定义记录初始屏幕宽度比例，便于初始化
var windowW = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '', //获取的token
    group: '', //获取的group
    id: '', //获取的id
    // points:[],//获取的供水温度id、回水温度id、发电功率id
    currentItem: '', //获取的点位id
    realTime:null,//实时数据对象(用于关闭实时刷新方法)
    zmdArr:[],//走马灯 展示
    detailslist1: [], //运行数据
    detailslist2: [], //更多数据
    // detailslist3: [], //计算数据
    // detailslist4: [], //其他数据
    swiper: [], //告警列表

    floorList: "", //图表
    tsData: [], //图表

    // 选项卡
    selected: true,
    selecte: false,

    showView: true, //去处理遮罩

    
    option: {
      //折线图标题
      // title: {
      //   text: '供水温度、回水温度、发电功率',
      //   left: 'center',
      //   top:'15'
      // },
      // 折线图线条的颜色
      color: ["#FE2E2E", "#1074E3", "#F99B03"],
      tooltip: {
        show: true,
        trigger: 'axis',
        backgroundColor: "rgba(44, 44, 44, 0.9)",
        formatter: function(datas) 
              {
                  var res = datas[0].name + '\n', val;
                  for(var i = 0, length = datas.length; i < length; i++) {
                      if(i==2){
                        val = (datas[i].value);
                        res += datas[i].seriesName + '：' + val + '\n';
                      } else{
                        val = (datas[i].value);
                        res += datas[i].seriesName + '：' + val + '\n';
                      }
                        
                    }
                    return res;
               }
      },
      legend: {
        data: ['供水温度℃', '回水温度℃', '发电功率kW', ],
        top: 18,
        left: 'center',
        // backgroundColor: 'red',
        z: 100
      },
      xAxis: {
        type: 'category',
        data: []
      },
      yAxis: {
        type: 'value',
        // name: '时间',
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
      series: [
        {
          data: [],
          type: 'line',
          smooth: true,
          symbol: 'none',
          name:'供水温度℃'
        },
        {
          data: [],
          type: 'line',
          smooth: true,
          symbol: 'none',
          name:'回水温度℃'
        },
        {
          data: [],
          type: 'line',
          smooth: true,
          symbol: 'none',
          name:'发电功率kW'
        },
    
        
        
      ]
    }
  },
  onPageScroll:function(e){
    if(e.scrollTop<0){
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  },
  // // 取消图表展示遮罩
  // userq: function () {
  //   this.setData({
  //     showView: (!this.data.showView),
  //   })
  //   wx.hideLoading();
  // },

  // // 图表展示遮罩
  // tubiao: function (e) {

  //   console.log(e.currentTarget.dataset,'图表展示666');
  //   this.setData({
  //     currentItem: e.currentTarget.dataset.item.id,
  //     showView: (!this.data.showView),
  //   })
  //   wx.showLoading({
  //     title: '数据加载中...',
  //   })

  //   const that = this
  //   const token = that.data.token
  //   const id = that.data.id
  //   const currentItem = e.currentTarget.dataset.item.id

  //   wx.request({
  //     url: 'https://ht.energytwin.com/mini_history/',
  //     data: {
  //       device: id,
  //       points:[
  //         currentItem,
  //       ] 
  //     },

  //     header: {
  //       'content-type': 'application/json', // 默认值
  //       'Authorization': `JWT ${token}`
  //     },
  //     method: 'POST',
  //     success: function (res) {
  //       console.log(res.data.data,'点击获取的图表信息');
  //       const tsData = res.data.data.map(item => {
  //         return {
  //           ...item,
  //           timestamp: that.formatTime(item.timestamp * 1000)
  //         }
  //       })
  //       let totalData = tsData.slice(0, 20).concat(tsData.slice(tsData.length - 20, tsData.length - 1))
  //       that.setData({
  //         tsData: totalData
  //       })

  //       setTimeout(function () {
  //         wx.hideLoading()
  //       }, 500)
  //     }
  //   })
  // },

  // // 选项卡点击切换
  select: function (e) {
    if ('w' == e.currentTarget.dataset.w) {
      this.setData({
        selected: true,
        selecte: false,
      })
    } else if ('y' == e.currentTarget.dataset.y) {
      this.setData({
        selected: false,
        selecte: true,
      })
    }
  },


  // 点击判断系统跳进详情页
  gengduo: function (e) {
    const item = e.currentTarget.dataset.item
    console.log(item,'点击更多数据页');
    wx.navigateTo({
      url: '/pages/Equipmentdetails/gengduo?item=' +JSON.stringify(item),
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const token = storage.get_token()
    var that = this
    that.setData({
      token: token
    })
    let regex = /\((.+?)\)/g;
    const itemObj = JSON.parse(options.item);
    const numtext = itemObj.device_num;
    const numId = numtext.match(regex);
    const textIndex = numId? numId[0]:numtext;
    wx.setNavigationBarTitle({
      title: itemObj.thumbnail_name
   })
    if (!token) {
      wx.reLaunch({
        url: '../indexs/indexs',
      })
    }

    // 屏幕宽度
    that.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth
    });
    console.log(this.data.imageWidth);

    //计算屏幕宽度比列
    windowW = this.data.imageWidth / 375;
    console.log(windowW);

    const jsonstr = JSON.parse(options.item)
    console.log("jsonstr======", jsonstr)
    const group = jsonstr.group
    const id = jsonstr.id
    that.setData({
      group: group,
      id: id
    })
    that.getList();
    this.data.realTime = setInterval(function () {
      that.getListHistory()
    }, 1000*60) 
    this.getzmdArr()
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
  formatTime(time) {
    const d = new Date(time)
    let batchTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    return batchTime
  },

getzmdArr(){//走马灯数据
  let that = this
    const token = that.data.token;
    const id = that.data.id
    wx.request({
      url: 'https://ht.energytwin.com/alarm/',
      method: 'get',
      data: {
        group:-1,
        stauts:0,
        start:0,
        end:9999999999,
        device:id
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `JWT ${token}`
      },
      success: function (res) {
        let arr = res.data.data.filter(el=>{return !el.automatic_recovery_time})
        that.setData({zmdArr:arr})
      }
    })
},

  // 搜索数据
  getListHistory:function(){
    const that = this
    const token = that.data.token
    const id = that.data.id
    wx.request({
      url: 'https://ht.energytwin.com/mini_deivce_detail/',
      data: {
        device: id,
      },
      method: 'post',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `JWT ${token}`
      },
      success: function (res) {
        console.log(res.data.data.普通数据,'详情页数据');
        that.setData({
          detailslist1: res.data.data.普通数据,
          detailslist2: res.data.data.更多数据,
        })
        let points = []
        let detailslist1 = res.data.data.普通数据;
        for (let i = 0; i < detailslist1.length; i++) {
          if (detailslist1[i].name === '供水温度' || detailslist1[i].name === '回水温度' || detailslist1[i].name === '发电功率') {
            console.log(detailslist1[i].id)
            points.push(detailslist1[i].id)
            console.log(1111111, points, 'pointspoints');
          }
        }
        wx.request({
          url: 'https://ht.energytwin.com/mini_history/',
          data: {
            device: id,
            points: points,
          },
          header: {
            'content-type': 'application/json', // 默认值
            'Authorization': `JWT ${token}`
          },
          method: 'POST',
          success: function (res) {
            var gs = []
            var hs = []
            var fd = []
            var ts = []
            for (var i = 0; i < res.data.data.length; i++) {
              gs.push(res.data.data[i][points[0]])
              hs.push(res.data.data[i][points[1]])
              fd.push(res.data.data[i][points[2]])
              ts.push(that.formatTime(res.data.data[i]['timestamp'] * 1000))
            }
            let value = 'option.xAxis.data'
            let value1 = 'option.series[0].data'
            let value2 = 'option.series[1].data'
            let value3 = 'option.series[2].data'
            that.setData({
              [value]: ts,
              [value1]:hs ,//供水
              [value2]:fd ,//回水
              [value3]:gs,//发电

            })
          },
        })
      }
    })

  },
  getList: function () {
    const that = this
    const token = that.data.token
    const id = that.data.id
    wx.showLoading({
      title: '数据加载中...',
    })
    wx.request({
      url: 'https://ht.energytwin.com/mini_deivce_detail/',
      data: {
        device: id,
      },
      method: 'post',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `JWT ${token}`
      },
      success: function (res) {
        console.log(res.data.data.普通数据,'详情页数据');
        that.setData({
          detailslist1: res.data.data.普通数据,
          detailslist2: res.data.data.更多数据,
        })
        let points = []
        let detailslist1 = res.data.data.普通数据;
        for (let i = 0; i < detailslist1.length; i++) {
          if (detailslist1[i].name === '供水温度' || detailslist1[i].name === '回水温度' || detailslist1[i].name === '发电功率') {
            console.log(detailslist1[i].id)
            points.push(detailslist1[i].id)
            console.log(1111111, points, 'pointspoints');
          }
        }
        wx.request({
          url: 'https://ht.energytwin.com/mini_history/',
          data: {
            device: id,
            points: points,
          },
          header: {
            'content-type': 'application/json', // 默认值
            'Authorization': `JWT ${token}`
          },
          method: 'POST',
          success: function (res) {
            // console.log(res.data.data, '图表33333333333333333');
            var gs = []
            var hs = []
            var fd = []
            var ts = []
            for (var i = 0; i < res.data.data.length; i++) {
              gs.push(res.data.data[i][points[0]])
              hs.push(res.data.data[i][points[1]])
              fd.push(res.data.data[i][points[2]])
              ts.push(that.formatTime(res.data.data[i]['timestamp'] * 1000))
            }
            // console.log(222333, gs, hs, fd, ts)
            let value = 'option.xAxis.data'
            let value1 = 'option.series[0].data'
            let value2 = 'option.series[1].data'
            let value3 = 'option.series[2].data'
            that.setData({
              [value]: ts,
              [value1]:hs ,//供水
              [value2]:fd ,//回水
              [value3]:gs,//发电

            })
            // console.log(that.data.option)
            // console.log(111122222, echarts)
          },
        })
        wx.stopPullDownRefresh();
        wx.hideLoading()
      }
    })

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
    console.log('444444444444444444',this.data.realTime)
    clearInterval(this.data.realTime)
    this.setData({
      realTime:null
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      this.getList()
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