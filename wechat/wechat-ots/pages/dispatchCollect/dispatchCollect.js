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
    platform: '******',
    show: false,
    collectFailType:"请选择类型",
    collectFailDescription:"请选择描述",
    collectFailTypeIndex:'',
    collectFailDescriptionIndex:'',
    collectFailReasonArray:[],
    collectFailDescriptionArray:[],
    textareaInput:'',
    crdflag: false,
    taskId:[]
  },
  onLoad(){
    var me = this
    //加载构建发车单界面
    me.getAllDispatchOrderList()
  },
  refresh(transportOrderInfo) {
    var me = this
    setTimeout(function () {
      me.refreshTransportOrder(transportOrderInfo)
    }, 2000)
  },
  refreshTransportOrder(transportOrderInfo){
    debugger
    var me = this;
    var serverUrl = app.serverUrl;

    var departcode = transportOrderInfo.departCode
    var warehouseCode = transportOrderInfo.warehouseCode
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchCollect/dispatchCollect'
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

  },
  getAllDispatchOrderList(){
    var me = this;
    var serverUrl = app.serverUrl;
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchCollect/dispatchCollect'
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
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
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
  onOpenDispatchOrder(event){
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
    var realUrl = '../dispatchCollect/dispatchCollect'
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
  onOpenDispatchWarehouse(event){
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
    var realUrl = '../dispatchCollect/dispatchCollect'
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
    var me = this
    var serverUrl = app.serverUrl;
    debugger
    var user = app.getGlobalUserInfo();
    var transportOrderlist = me.data.transportOrderlist;
    var arrindex = e.target.dataset.arrindex;
    var transportDetailInfo = JSON.stringify(transportOrderlist[arrindex]);
    var realUrl = '../transportDetailInfo/transportDetailInfo#transportDetailInfo@' + transportDetailInfo;
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
     
      wx.navigateTo({
        url: '../transportDetailInfo/transportDetailInfo?transportDetailInfo=' + transportDetailInfo
      })
    }
  },
  sectionCollect: function(e){
    var me = this
    var serverUrl = app.serverUrl;
    var user = app.getGlobalUserInfo();
    var transportOrderlist = me.data.transportOrderlist;
    var arrindex = e.target.dataset.arrindex;
    var transportDetailInfo = JSON.stringify(transportOrderlist[arrindex]);
    var realUrl = '../sectionCollect/sectionCollect#transportDetailInfo@' + transportDetailInfo
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      
      wx.navigateTo({
        url: '../sectionCollect/sectionCollect?transportDetailInfo=' + transportDetailInfo,
      })
    }
  },
  showCollectFail:function(e){
    var me = this;
    var serverUrl = app.serverUrl;
    var arrindex = e.currentTarget.dataset.arrindex;
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchCollect/dispatchCollect'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      me.setData({
        show: true,
        crdflag: false,
        collectFailType: "请选择类型",
        collectFailDescription: "请选择描述",
        collectFailTypeIndex: "",
        collectFailDescriptionIndex: "",
        taskId:[arrindex],
        textareaInput:''
      })
      wx.showLoading({
        title: '请等待,加载中....',
      })
      var recordType = 'TMS_COLLECT_TYPE';
      wx.request({
        url: serverUrl + '/api/ots/wx/loadDataFilterSelectByRecordType',
        method: "POST",
        data: {
          recordType: recordType
        },
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
            var collectFailReasonArray = res.data;
            me.setData({
              collectFailReasonArray: collectFailReasonArray
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
  closeCollectFail: function(e){
    var me = this;
    me.setData({
      show: false
    })
  },
  
  checkCollectReasonDescription: function(e){
    var me = this;
    
    var collectFailTypeIndex = me.data.collectFailTypeIndex;
    if (collectFailTypeIndex == null || collectFailTypeIndex == ''
      || collectFailTypeIndex == undefined) {
      wx.showToast({
        title: '请选择揽收失败类型',
        icon: "none"
      })
      return;
    }

  },
  changeType: function (e) {
    var me = this;
    var serverUrl = app.serverUrl;
    var index = e.detail.value;
    var collectFailType = me.data.collectFailReasonArray[index].label;
    var reasonCode = me.data.collectFailReasonArray[index].id;
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchCollect/dispatchCollect'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      me.setData({
        collectFailType: collectFailType,
        collectFailTypeIndex: index,
        crdflag: true,
        collectFailDescription: "请选择描述"
      });
      wx.request({
        url: serverUrl + '/api/ots/wx/loadDataFilterSelectByReasonCode',
        method: "POST",
        data: {
          reasonCode: reasonCode
        },
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
            var collectFailDescriptionArray = res.data;
            me.setData({
              collectFailDescriptionArray: collectFailDescriptionArray
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
  changeDescription: function (e) {
    var me = this;
    var index = e.detail.value;
    var collectFailDescription = me.data.collectFailDescriptionArray[index].label;
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchCollect/dispatchCollect'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      me.setData({
        collectFailDescription: collectFailDescription,
        collectFailDescriptionIndex:index
      });
    }
  },
  bindWordLimit:function(e){
    var me = this;
    var textareaInput = e.detail.value;
    me.setData({
      textareaInput: textareaInput
    })
  },
  submitcollectFail:function(e){
    var me = this;
    var serverUrl = app.serverUrl;
    var description = me.data.textareaInput
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchCollect/dispatchCollect'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      //获取异常类型
      var collectFailTypeIndex = me.data.collectFailTypeIndex;
      if (collectFailTypeIndex == null || collectFailTypeIndex == '' 
        || collectFailTypeIndex == undefined) {
        wx.showToast({
          title: '选择揽收失败类型',
          icon: "none",
          duration: 2000
        })
        return;
      }
      var collectFailType = me.data.collectFailReasonArray[collectFailTypeIndex].id;
      
      //获取异常描述
      var collectFailDescriptionIndex = me.data.collectFailDescriptionIndex;
      if (collectFailDescriptionIndex == null || collectFailDescriptionIndex == ''
        || collectFailDescriptionIndex == undefined) {
        wx.showToast({
          title: '选择揽收失败描述',
          icon: "none",
          duration: 2000
        })
        return;
      }
      var collectFailDescription = me.data.collectFailDescriptionArray[collectFailDescriptionIndex].id;


      //获取当前操作订单ID
      var taskId = me.data.taskId;
      var id = [me.data.transportOrderlist[taskId].id];
      wx.showLoading({
        title: '请等待,加载中....',
      })
      //TODO 请求到接口
      wx.request({
        url: serverUrl + '/api/ots/wx/batchErrorRegister',
        method: "POST",
        data: {
          reasonCode: collectFailType,
          reasonContent: collectFailDescription,
          description: description,
          ids: id,
          typeCode: "transportHeader"
        },
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
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            me.setData({
              show: false
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
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
  scanCode: function (e) {
    var me = this
    var serverUrl = app.serverUrl
    wx.scanCode({
      success: function (res) {
        var scanCode = res.result;
        var user = app.getGlobalUserInfo();
        var realUrl = '../dispatchCollect/dispatchCollect'
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
              if (scanFlag == 'isDepart') {
                var dispatchOrderlist = []
                dispatchOrderlist.push(res.data.data.dispatchOrder)
                me.setData({
                  dispatchOrderlist: dispatchOrderlist
                })
              } else {
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
      fail: function (res) {
        debugger
        wx.showToast({
          title: '扫描失败',
          icon: none,
          duration: 2000
        })
      }
    })
  },
  collect:function(e){
    var me = this
    var serverUrl = app.serverUrl;
    
    wx.showModal({
      title: '是否确认揽收?',
      success(res) {
        if (res.confirm) {
          var transportOrderlist = me.data.transportOrderlist;
          var arrindex = e.currentTarget.dataset.arrindex;
          var transportOrderInfo = transportOrderlist[arrindex];
          var taskStatus = transportOrderInfo.taskStatus;
          var id = [transportOrderInfo.id]
          var user = app.getGlobalUserInfo();
          var realUrl = '../dispatchCollect/dispatchCollect'
          if (user == null || user == undefined || user == '') {
            wx.redirectTo({
              url: '../userLogin/userLogin?redirectUrl=' + realUrl,
            })
          }else{
            if (taskStatus !== 620) {
              wx.showToast({
                title: '该单不是待签收状态',
                icon: 'none',
                duration: 2000
              })
              return
            }
            wx.showLoading({
              title: '请等待,加载中....',
            })
            wx.request({
              url: serverUrl + '/api/ots/wx/batchCollect',
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
                    title: '揽收成功',
                    icon: 'success',
                    duration: 2000
                  })
                  me.refresh(transportOrderInfo)
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
