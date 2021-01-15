//index.js
//获取应用实例
const storage =  require("../../utils/storage");
const app = getApp()

Page({
  data: {
    realTime: null,//实时数据对象(用于关闭实时刷新方法)

    pic_array:[],//组件下拉框
    hx_index: 0,//组件下拉框
    pic_arrayname:'所有项目',

    group:-1,//项目id

    newArray:   [], //运行
    newArray2:  [], //离线
    newArray3:  [], //故障
    newArray4:  [], //待机
    newArray5:  [], //在线
    
    // "image" : "/image/img.png",  //背景图片

    token: '',//获取的token
    arrgy:'',//设备总数
    arrgy1 : '',//在线
    arrgy2:'',//离线设备总数
    arrgy3:'',//报警未处理

    status:'',//设备状态
    device:'',//设备id


    // 地图
    // latitude: [],
    // longitude: [],
      // latitude: 31.22352,
      // longitude: 121.45591,
    // 下面代码会在对应位置生成箭头
      // markers: [],
    latitude: 31.22352, //地图界面中心的纬度
    longitude: 121.45591, //地图界面中心的经度
    markers: [],

    // 选项卡
    // selected: true,
    // selecte: false,


    // show:false, //控制下拉列表的显示隐藏，false隐藏、true显示
    // selectData: ['项目1','项目2',],  //自定义下拉列表的数据
    // index:0, //选择的自定义下拉列表下标
    // Indexs:"",//选择的自定义下拉列表内容
  },

  // picker组件下拉框
  bindPickerChange_hx: function (e) {
    const that = this
    const token = that.data.token
    // console.log('点击选项项目名:', e.target.dataset.selecthx);
    // console.log('点击选项的id:', e.target.dataset.id);
    console.log('项目名:', this.data.pic_array[e.detail.value].name);
    console.log('项目id:', this.data.pic_array[e.detail.value].id);
    that.setData({   //给变量赋值
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
        let pagedata = res.data.data;
        let markArr = [];
        
        that.setData({
          markers:pagedata,
          arrgy : pagedata,
        })
        console.log(that.data.markers,'55555555555555555555555555555')
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







  // // 点击下拉显示框
  // selectTap(){
  //   this.setData({
  //     show: !this.data.show
  //   });
  // },
  // // 点击下拉列表
  // optionTap(e){
  //   // console.log(e,'44444444444444');
  //   console.log(this.data.selectData,'333333333333333333');
  //   let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
  //   let Indexss = e.currentTarget.dataset.item;//获取点击的下拉列表的内容
  //   this.setData({
  //     index:Index,
  //     Indexs:Indexss,
  //     show:!this.data.show
  //   }); 
  // },

  // // 选项卡点击切换
  // select: function (e) {
  //   if ('w' == e.currentTarget.dataset.w) {
  //     this.setData({
  //       selected: true,
  //       selecte: false,
  //     })
  //   } else if ('y' == e.currentTarget.dataset.y) {
  //     this.setData({
  //       selected: false,
  //       selecte: true,
  //     })
  //   }
  // },

  onLoad: function () {
    // var that = this 
    // wx.getLocation({
    //   type: "wgs84",
    //   success: function (res) {
    //     console.log(res,'wgs84wgs84wgs84wgs84地图');
    //     var latitude = res.latitude;
    //     var longitude = res.longitude;
    //     console.log("当前位置的经纬度为：", res.latitude, res.longitude);
    //     that.setData({
    //       latitude: latitude,
    //       longitude: longitude,
    //     })
    //   }
    // })
  },


  onShow: function() {
    const token  = storage.get_token()
    var that = this 
    that.setData({token:token})
    // console.log(token,'000000');
    if (!token) {
      wx.reLaunch({
        url: '../indexs/indexs',
      })
    }
    var that = this;
    that.getList1();
    that.getname();
    that.getList3();
    that.getList4();


    // that.data.realTime = setInterval(function(){
    //   let that = this;
    //   // 请求服务器数据
    //   // console.log('请求接口：刷新数据')
    //   that.getList1();
    //   that.getname();
    //   that.getList3();
    //   that.getList4();
    //   // 反馈提示
    //   // wx.showToast({
    //   //   title: '数据已更新！'
    //   // })

    // }, 6000)//间隔时间

    // 更新数据
    this.setData({
      realTime:this.data.realTime,//实时数据对象(用于关闭实时刷新方法)
    })
  },
  onPullDownRefresh: function() {
          var that = this;
    　　　 wx.showNavigationBarLoading()  //在标题栏中显示加载
          that.getList1();
          that.getname();
          that.getList3();
          that.getList4();  //重新加载数据
    　　　　//模拟加载  1秒
    　　　　setTimeout(function () {
    　　　　// complete
    　　　　wx.hideNavigationBarLoading() //完成停止加载
    　　　　wx.stopPullDownRefresh() //停止下拉刷新
    　　　　}, 1000);
  },
  getname:function(){
    const that = this
    const token = that.data.token
    wx.request({
      url: 'https://ht.energytwin.com/my_user_info',
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `JWT ${token}`
      },
      success: function(res){
        console.log(res.data.data,'获取用户的个人信息999999');
        wx.setStorageSync('all_roles', res.data.data.all_roles)
      }
    })
  },

  getList1:function(){
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
      success: function(res){
        console.log(res.data.data,'分组下所有设备999999');

      
        let pagedata = res.data.data
        that.setData({
          arrgy : pagedata,
          markers:pagedata,
        })
        console.log(that.data.markers,'55555555555555555555555555555')

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

  getList3:function(){
    const that = this
    const token = that.data.token
    const group = that.data.group
    const status = that.data.status
    const device = that.data.device
    wx.request({
      url: 'https://ht.energytwin.com/alarm/',
      method: 'get',
      data: {
        group: group,
        status:that.data.status,
        device:that.data.device
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `JWT ${token}`
      },
      success: function(res){
        console.log(res,'首页报警未处理设备999999');
        that.setData({
          arrgy3 : res.data.data//报警未处理
        })
      }
    })
  },

  getList4:function(){
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
        console.log(pic_array,'首页获取当前用户所有的项目分组999999');
      }
    })
  },

  tiao1:function () {//运行
    wx.reLaunch({
      url: "../Equipmentdetails/Equipmentdetails?active_view=运行",
    })
  },
  tiao2:function () {
    wx.reLaunch({
      url: '../Equipmentdetails/Equipmentdetails?active_view=离线',
    })
  },
  tiao3:function () {
    wx.reLaunch({
      url: '../Equipmentdetails/Equipmentdetails?active_view=待机',
    })
  },
  tiao4:function () {
    wx.reLaunch({
      url: '../Equipmentdetails/Equipmentdetails?active_view=故障',
    })
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
    /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.realTime)
 },

})
