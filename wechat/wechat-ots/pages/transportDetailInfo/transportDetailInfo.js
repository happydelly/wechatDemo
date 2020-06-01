//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    transportDetailList:[],
     isExist: true
  },
  onLoad(params){
    var me = this;
    var serverUrl = app.serverUrl;
    //获取上一个页面传入的参数
    var transportDetailInfo = JSON.parse(params.transportDetailInfo);
    var taskid = transportDetailInfo.id; //获取运输单ID
    var user = app.getGlobalUserInfo();
    var realUrl = '../transportDetailInfo/transportDetailInfo#transportDetailInfo@' + params.transportDetailInfo;
    wx.request({
      url: serverUrl + '/api/ots/wx/findTransportOrderDetailById?id=' +taskid,
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
      success: function (res) {
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
          var transportDetailList = res.data.data;
          me.setData({
            transportDetailList: transportDetailList
          })
        }else{
          me.setData({
            isExist: false
          })
        } 
      },
      fail: function (res) {
        console.log(res.data)
        wx.hideLoading();
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  }
})
