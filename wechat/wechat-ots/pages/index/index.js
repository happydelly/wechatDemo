//获取应用实例
const app = getApp()
Page({
  data: {
   
  },
  onLoad(){
    var me = this
   
  },
  showPickUp:function(e){
    var me = this
    wx.navigateTo({
      url: '../dispatchPickUp/dispatchPickUp'
    })
  },
  showCollect:function(e){
    var me = this
    wx.navigateTo({
      url: '../dispatchCollect/dispatchCollect'
    })
  },
  showAbnormal:function(e){
    var me = this
    wx.navigateTo({
      url: '../dispatchAbnormal/dispatchAbnormal'
    })
  },
  showSign:function(e){
    var me = this
    wx.navigateTo({
      url: '../dispatchSign/dispatchSign'
    })
  }
})
