let set_token = (token) => {
  let timestamp = new Date().getTime();
  let expiration = timestamp + 60 * 1000 * 60 * 48; //缓存两天
  // let expiration = timestamp + 60 * 1000; //缓存两天
  wx.setStorageSync("data_expiration", expiration)
  wx.setStorageSync("token", token)
}

let get_token =()=>{
  let timestamp = new Date().getTime();
  let data_expiration = wx.getStorageSync("data_expiration");
  console.log(data_expiration,'111111111');
  console.log(timestamp,'222222222');
  if (data_expiration) {
      if (timestamp > data_expiration) {
          wx.clearStorageSync()
      }else {
          return wx.getStorageSync("token");
      }
  }
}

let fun_map={
  get_token:get_token,
  set_token:set_token,
}

module.exports = fun_map
