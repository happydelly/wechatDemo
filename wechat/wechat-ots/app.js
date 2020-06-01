//app.js
App({
  serverUrl: "http://localhost:9001",
  //serverUrl: "http://8s5i38.natappfree.cc"
  isNum: /^[0-9]*$/,
  isPhone: /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/,
  isCaptcha: /^\d{6,}$/,
  userInfo: null,
  setGlobalUserInfo: function(user){
    wx.setStorageSync("userInfo", user)
  },
  getGlobalUserInfo: function () {
   return wx.getStorageSync("userInfo")
  }

})