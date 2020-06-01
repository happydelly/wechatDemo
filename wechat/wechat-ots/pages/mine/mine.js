//获取应用实例
const app = getApp()
Page({
  data: {
    faceUrl: "../resource/images/noneface.png",
    nickname:"csj",
  },
  onLoad(){
    debugger
    var me = this
    var user = app.getGlobalUserInfo();
    var userId = user.id;

    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '请等待...',
    });

    wx.request({
      url: serverUrl + '/api/ots/wx/findDriverById?id=' + userId ,
      method: "POST",
      header: {
        'headerUserId': user.id,
        'headerUserToken': user.sessionToken,
        'content-type': 'application/json', // 默认值
        'x-cbtVersion': '2.8.0 - SNAPSHOT',
        'X-Client': '8f5113091d384eb5a0d2d72eeb9af8aa',
        'X-DB': 'ttx-xwms-test',
        'x-device': 'browser',
        'X-Requested-With': 'XMLHttpRequest',
        'x-t': '1586764240909',
        'X-Token': '7875e57d22d946e898ae67e7297f1f5a',
        'X-User': 'admin',
        'x-v': '2zwAzUQ2Z0Gam3UOR'
      },
      success: function(res) {
        console.log(res.data);
        wx.hideLoading();
        debugger
        var parameters = res.data.parameters
        if(parameters != undefined){
          if(parameters[0] == 502){
            wx.showToast({
              title: res.data.msg,
              duration: 3000,
              icon: "none",
              success: function() {
                wx.redirectTo({
                  url: '../userLogin/userLogin?redirectUrl=' + realUrl,
                })
              }
            })
          }
        }
        if (!res.data.error) {
          var userinfo = res.data.data;
          var faceUrl = "../resource/images/noneface.png";
          if (userinfo.faceImage != null && userinfo.faceImage != '' &&
            userinfo.faceImage != undefined) {
            // faceUrl = serverUrl + userinfo.faceImage
            faceUrl = userinfo.faceImage
          }

          me.setData({
            faceUrl: faceUrl,
            nickname: userinfo.nickName,
          });
        } else{
          wx.showToast({
            title: res.data.msg,
            duration: 3000,
            icon: "none",
            success: function() {
              wx.redirectTo({
                url: '../userLogin/userLogin',
              })
            }
          })
        }
      }
    })
  },
  logout:function(e){
    //注销以后清空缓存
    wx.removeStorageSync("userInfo")
    //TODO 页面跳转
    wx.navigateTo({
      url: '../userLogin/userLogin'
    })
  }
})
