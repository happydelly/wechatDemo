//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imageList: ['../resource/images/default.png',
    '../resource/images/default.png',
    '../resource/images/default.png'
    ]
  },
  onLoad(params){
    var me = this;
    var serverUrl = app.serverUrl;
    //获取上一个页面传入的参数
    //var receiptOrderInfo = JSON.parse(params.receiptOrderInfo);
    
  },
  chooseImg:function(e){
    var me = this;
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      count: 3,
      success: function(res) {
        me.setData({
          imageList: res.tempFilePaths
        })
      },
    })
  },
  uploadImage:function(e){
    debugger
    var me = this;
    var imageList = me.data.imageList;
    var length = me.data.imageList.length; //上传图片数量
    var count = 0; //第几张
    var num = 1
    
    me.uploadOneByOne(imageList, count, length, num)
  },
  uploadOneByOne: function (imageList, count,length,num){
    var me = this;
    
    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '正在上传第' + num + '张',
    });
    wx.uploadFile({
      url: serverUrl + '/api/ots/sync/upload',
      filePath: imageList[count],
      name: 'file',
      header: {
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
      success(res) {
        wx.hideLoading();
        console.log(res)
      },
      complete(res){
        count++;//下一张
        num++;
        if (count == length) {
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000
          })
        }else{
          me.uploadOneByOne(imageList, count, length, num)
        }
      }
    })
  },
  previewImage:function(e){
    var me = this;
    var current = e.currentTarget.dataset.src;
    var imageList = me.data.imageList;
    wx.previewImage({
      current: current,
      urls: imageList
    })
  }
})
