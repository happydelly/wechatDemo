//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    dispatchOrderName: '',
    activeName: '',
    transportOrderName:'',
    page: 1,
    dispatchOrderlist:[],
    dispatchWarehouselist: [],
    transportOrderlist: [],
    platform: '******'
  },
  onLoad(){
    var me = this
    //加载构建发车单界面
    me.getAllDispatchOrderList()
  },
  refresh() {
    var me = this
    setTimeout(function () {
      me.getAllDispatchOrderList()
    }, 2000)
  },
  getAllDispatchOrderList(){
    var me = this;
    var serverUrl = app.serverUrl;
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchPickUp/dispatchPickUp'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      wx.showLoading({
        title: '请等待,加载中....',
      })
      wx.request({
        url: serverUrl + '/api/ots/wx/getDispatchOrder',
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
        success: function(res){
          wx.hideLoading();
          console.log(res.data)
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
          if(!res.data.error){
            var dispatchOrderlist = res.data.data;
            me.setData({
              dispatchOrderlist: dispatchOrderlist
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
  },
  onOpenDispatchOrder(event) {
    var me = this
    me.setData({
      dispatchOrderName: event.detail,
      dispatchWarehouseName: "",
      transportOrderName:""
    });
    
    var serverUrl = app.serverUrl;
    var dispatchOrderlist = me.data.dispatchOrderlist;
    var arrindex = event.currentTarget.dataset.arrindex;
    var dispatchOrderInfo = dispatchOrderlist[arrindex];
    var departcode = dispatchOrderInfo.departcode
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchPickUp/dispatchPickUp'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      wx.showLoading({
        title: '请等待,加载中....',
      })
      wx.request({
        url: serverUrl + '/api/ots/wx/findDispatchWarehouse?departCode=' + departcode,
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
          wx.hideLoading();
          console.log(res.data)
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
            var dispatchWarehouselist = res.data.data;
            me.setData({
              dispatchWarehouselist: dispatchWarehouselist
            })
          } else {
            me.setData({
              dispatchWarehouselist: []
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
  }, 
  onCloseDispatchOrder(event){
    var me = this
    me.setData({
      dispatchOrderName: "",
      dispatchWarehouseName: "",
      transportOrderName:""
    });
  },
  onOpenDispatchWarehouse(event) {
    var me = this
    me.setData({
      dispatchWarehouseName: event.detail
    });
    var serverUrl = app.serverUrl;
    var dispatchWarehouselist = me.data.dispatchWarehouselist
    var arrindex = event.currentTarget.dataset.arrindex;
    var dispatchWarehouseInfo = dispatchWarehouselist[arrindex];
    var departcode = dispatchWarehouseInfo.departCode
    var warehouseCode = dispatchWarehouseInfo.warehouseCode

    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchPickUp/dispatchPickUp'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      wx.showLoading({
        title: '请等待,加载中....',
      })
      wx.request({
        url: serverUrl + '/api/ots/wx/findTransportOrder?departCode=' + departcode + '&warehouseCode=' + warehouseCode,
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
          wx.hideLoading();
          console.log(res.data)
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
            var transportOrderlist = res.data.data;
            me.setData({
              transportOrderlist: transportOrderlist
            })
          } else {
            me.setData({
              transportOrderlist: []
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
  },
  onCloseDispatchWarehouse(event){
    var me = this
    me.setData({
      dispatchWarehouseName: "",
      transportOrderName:""
    });
  },
  onOpenTransportOrder(event){
    this.setData({
      transportOrderName: event.detail
    });
  },
  onCloseTransportOrder(event){
    this.setData({
      transportOrderName: ""
    });
  },
  showTransportOrderDetail:function(e){
    debugger
    var me = this
    var serverUrl = app.serverUrl;
    var user = app.getGlobalUserInfo();
    var transportOrderlist = me.data.transportOrderlist;
    var arrindex = e.target.dataset.arrindex;
    var transportDetailInfo = JSON.stringify(transportOrderlist[arrindex]);
    var realUrl = '../transportDetailInfo/transportDetailInfo#transportDetailInfo@' + transportDetailInfo
    
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      wx.navigateTo({
        url: '../transportDetailInfo/transportDetailInfo?transportDetailInfo=' + transportDetailInfo,
      })
    }
  },
  scanCode:function(e){
    var me = this
    var serverUrl = app.serverUrl
    wx.scanCode({
      success:function(res){
        var scanCode = res.result;
        var user = app.getGlobalUserInfo();
        wx.showLoading({
          title: '请等待,加载中....',
        })
        wx.request({
          url: serverUrl + '/api/ots/wx/findDispatchAndTransportOrderByScanCode?scanCode=' + scanCode,
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
            wx.hideLoading();
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
              var scanFlag = res.data.data.scanFlag
              if (scanFlag == 'isDepart'){
                var dispatchOrderlist = []
                dispatchOrderlist.push(res.data.data.dispatchOrder)
                me.setData({
                  dispatchOrderlist: dispatchOrderlist
                })
              }else{
                console.log(res.data.data)
                var dispatchOrderlist = []
                var dispatchWarehouselist = []
                var transportOrderlist = []
                var orderId = res.data.data.dispatchOrder.id;
                var warehouseCode = res.data.data.dispatchWarehouse.warehouseCode;
                var orderCode = res.data.data.taskTranSportHeader.orderCode;
                dispatchOrderlist.push(res.data.data.dispatchOrder);
                dispatchWarehouselist.push(res.data.data.dispatchWarehouse);
                transportOrderlist.push(res.data.data.taskTranSportHeader);
                me.setData({
                  dispatchOrderlist: dispatchOrderlist,
                  dispatchWarehouselist: dispatchWarehouselist,
                  transportOrderlist: transportOrderlist,
                  dispatchOrderName: orderId,
                  dispatchWarehouseName: warehouseCode,
                  transportOrderName: orderCode
                })
              }
              
              // var dispatchWarehouselist = res.data.data;
              // me.setData({
              //   dispatchWarehouselist: dispatchWarehouselist,
              //   dispatchOrderName: 1
              // })
            } else {
              me.setData({
                dispatchWarehouselist: []
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
        
      },
      fail:function(res){
        debugger
        wx.showToast({
          title: '扫描失败',
          icon: none,
          duration: 2000
        })
      }
    })
  },
  preCool:function(e){
    var me = this
    var serverUrl = app.serverUrl;
    
    wx.showModal({
      title: '是否确认预冷?',
      success(res) {
        if (res.confirm) {
          var dispatchOrderlist = me.data.dispatchOrderlist;
          var arrindex = e.currentTarget.dataset.arrindex;
          var dispatchOrderInfo = dispatchOrderlist[arrindex];
          var departStatus = dispatchOrderInfo.departStatus
          var preCoolFlag = dispatchOrderInfo.preCoolFlag
          var id = [dispatchOrderInfo.id]
          var user = app.getGlobalUserInfo();
          var realUrl = '../dispatchPickUp/dispatchPickUp'
          if (user == null || user == undefined || user == '') {
            wx.redirectTo({
              url: '../userLogin/userLogin?redirectUrl=' + realUrl,
            })
          }else{
            if (departStatus !== '610') {
              wx.showToast({
                title: '该发车单不是待发车状态',
                icon: 'none',
                duration: 2000
              })
              return
            }
            if (preCoolFlag !== 0 ) {
              wx.showToast({
                title: '该发车单不是未预冷状态',
                icon: 'none',
                duration: 2000
              })
              return
            }
            wx.showLoading({
              title: '请等待,加载中....',
            })
            wx.request({
              url: serverUrl + '/api/ots/wx/batchPreCool',
              method: "POST",
              data: id,
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
                wx.hideLoading();
                console.log(res.data)
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
                  wx.showToast({
                    title: '预冷成功',
                    icon: 'success',
                    duration: 2000
                  })
                  me.refresh()
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
        } else {
          console.log('点击了取消')
        }
      }
    })
  },
  endPreCool: function (e) {
    var me = this
    var serverUrl = app.serverUrl;

    wx.showModal({
      title: '是否确认结束预冷?',
      success(res) {
        if (res.confirm) {
          var dispatchOrderlist = me.data.dispatchOrderlist;
          var arrindex = e.currentTarget.dataset.arrindex;
          var dispatchOrderInfo = dispatchOrderlist[arrindex];
          var departStatus = dispatchOrderInfo.departStatus
          var preCoolFlag = dispatchOrderInfo.preCoolFlag
          var id = [dispatchOrderInfo.id]
          var user = app.getGlobalUserInfo();
          var realUrl = '../dispatchPickUp/dispatchPickUp'
          if (user == null || user == undefined || user == '') {
            wx.redirectTo({
              url: '../userLogin/userLogin?redirectUrl=' + realUrl,
            })
          }else{
            if (departStatus !== '610') {
              wx.showToast({
                title: '该发车单不是待发车状态',
                icon: 'none',
                duration: 2000
              })
              return
            }
            if (preCoolFlag !== 1) {
              wx.showToast({
                title: '该发车单不是预冷开始状态',
                icon: 'none',
                duration: 2000
              })
              return
            }
            wx.showLoading({
              title: '请等待,加载中....',
            })
            wx.request({
              url: serverUrl + '/api/ots/wx/batchEndPreCool',
              method: "POST",
              data: id,
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
                wx.hideLoading();
                debugger
                console.log(res.data)
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
                  wx.showToast({
                    title: '结束预冷成功',
                    icon: 'success',
                    duration: 2000
                  })
                  me.refresh()
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
        } else {
          console.log('点击了取消')
        }
      }
    })
  },
  depart: function(e){
    var me = this
    var serverUrl = app.serverUrl;

    wx.showModal({
      title: '是否确认发车?',
      success(res) {
        if (res.confirm) {
          var dispatchOrderlist = me.data.dispatchOrderlist;
          var arrindex = e.currentTarget.dataset.arrindex;
          var dispatchOrderInfo = dispatchOrderlist[arrindex];
          var departStatus = dispatchOrderInfo.departStatus;
          var id = [dispatchOrderInfo.id];
          var user = app.getGlobalUserInfo();
          var realUrl = '../dispatchPickUp/dispatchPickUp'
          if (user == null || user == undefined || user == '') {
            wx.redirectTo({
              url: '../userLogin/userLogin?redirectUrl=' + realUrl,
            })
          }else{
            if (departStatus !== '610') {
              wx.showToast({
                title: '该发车单不是待发车状态',
                icon: 'none',
                duration: 2000
              })
              return
            }
            wx.showLoading({
              title: '请等待,加载中....',
            })
            wx.request({
              url: serverUrl + '/api/ots/wx/batchDepart',
              method: "POST",
              data: id,
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
                debugger
                wx.hideLoading();
                console.log(res.data)
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
                  wx.showToast({
                    title: '操作发车成功',
                    icon: 'success',
                    duration: 2000
                  })
                  me.refresh()
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
        } else {
          console.log('点击了取消')
        }
      }
    })
  },
  arrivals: function (e) {
    var me = this
    var serverUrl = app.serverUrl;

    wx.showModal({
      title: '是否确认到车?',
      success(res) {
        if (res.confirm) {
          var dispatchOrderlist = me.data.dispatchOrderlist;
          var arrindex = e.currentTarget.dataset.arrindex;
          var dispatchOrderInfo = dispatchOrderlist[arrindex];
          var departStatus = dispatchOrderInfo.departStatus;
          var id = [dispatchOrderInfo.id];
          var user = app.getGlobalUserInfo();
          var realUrl = '../dispatchPickUp/dispatchPickUp'
          if (user == null || user == undefined || user == '') {
            wx.redirectTo({
              url: '../userLogin/userLogin?redirectUrl=' + realUrl,
            })
          }else{
            if (departStatus !== '520') {
              wx.showToast({
                title: '该发车单不是待到车状态',
                icon: 'none',
                duration: 2000
              })
              return
            }
            wx.showLoading({
              title: '请等待,加载中....',
            })
            wx.request({
              url: serverUrl + '/api/ots/wx/batchArrivals',
              method: "POST",
              data: id,
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
                wx.hideLoading();
                console.log(res.data)
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
                  wx.showToast({
                    title: '操作到车成功',
                    icon: 'success',
                    duration: 2000
                  })
                  me.refresh()
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
        } else {
          console.log('点击了取消')
        }
      }
    })
  }

})
