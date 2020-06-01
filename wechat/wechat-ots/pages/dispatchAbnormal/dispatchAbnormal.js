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
    showOrder: false,
    showCar: false,
    orderErrorType:"请选择类型",
    orderErrorDescription:"请选择描述",
    orderErrorTypeIndex:'',
    orderErrorDescriptionIndex:'',
    orderErrorTypeArray: [],
    orderErrorDescriptionArray: [],
    carErrorTypeArray:[],
    carErrorDescriptionArray:[],
    carErrorType: "请选择类型",
    carErrorDescription: "请选择描述",
    carErrorTypeIndex:'',
    carErrorDescriptionIndex:'',
    textareaInput:'',
    carErrorflag: false,
    taskId:""
  },
  onLoad(){
    var me = this
    //加载构建发车单界面
    me.getAllDispatchOrderList()
  },
  getAllDispatchOrderList(){
    var me = this;
    var serverUrl = app.serverUrl;
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchAbnormal/dispatchAbnormal'
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
  onOpenDispatchOrder(event) {
    var me = this
    me.setData({
      dispatchOrderName: event.detail,
      transportOrderName:""
    });

    var serverUrl = app.serverUrl;
    var dispatchOrderlist = me.data.dispatchOrderlist;
    var arrindex = event.currentTarget.dataset.arrindex;
    var dispatchOrderInfo = dispatchOrderlist[arrindex];
    var departcode = dispatchOrderInfo.departcode
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchAbnormal/dispatchAbnormal'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      wx.showLoading({
        title: '请等待,加载中....',
      })
      wx.request({
        url: serverUrl + '/api/ots/wx/findTransportOrder?departCode=' + departcode,
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
  onCloseDispatchOrder(event){
    var me = this
    me.setData({
      dispatchOrderName: "",
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
  showOrderError:function(e){
    var me = this;
    var serverUrl = app.serverUrl;
    var arrindex = e.currentTarget.dataset.arrindex;
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchAbnormal/dispatchAbnormal'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      me.setData({
        showOrder: true,
        orderErrorflag: false,
        orderErrorType: "请选择类型",
        orderErrorDescription: "请选择描述",
        orderErrorTypeIndex: "",
        orderErrorDescriptionIndex: "",
        taskId:arrindex,
        textareaInput: ""
      })
      wx.showLoading({
        title: '请等待,加载中....',
      })
      var recordType = 'TMS_DELIVERY_TYPE';
      var identifier = 'TMS_DELIVERY_ORDER';
      wx.request({
        url: serverUrl + '/api/ots/wx/loadDataFilterSelectByRecordType',
        method: "POST",
        data: {
          recordType: recordType,
          identifier: identifier
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
            var orderErrorTypeArray = res.data;
            me.setData({
              orderErrorTypeArray: orderErrorTypeArray
            })
          }
        },
        fail: function (res) {
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
  showCarError: function (e) {
    var me = this;
    var serverUrl = app.serverUrl;
    var arrindex = e.currentTarget.dataset.arrindex;
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchAbnormal/dispatchAbnormal'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      me.setData({
        showCar: true,
        carErrorflag: false,
        carErrorType: "请选择类型",
        carErrorDescription: "请选择描述",
        carErrorTypeIndex: "",
        carErrorDescriptionIndex: "",
        taskId:arrindex,
        textareaInput: ""
      })
      wx.showLoading({
        title: '请等待,加载中....',
      })
      var recordType = 'TMS_DELIVERY_TYPE';
      var identifier = 'TMS_DELIVERY_CAR';
      wx.request({
        url: serverUrl + '/api/ots/wx/loadDataFilterSelectByRecordType',
        method: "POST",
        data: {
          recordType: recordType,
          identifier: identifier
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
            var carErrorTypeArray = res.data;
            me.setData({
              carErrorTypeArray: carErrorTypeArray
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
  closeCarError: function (e) {
    var me = this;
    me.setData({
      showCar: false
    })
  },
  closeOrderError: function(e){
    var me = this;
    me.setData({
      showOrder: false
    })
  },
  changeCarErrorType: function (e) {
    var me = this;
    var serverUrl = app.serverUrl;
    var index = e.detail.value;
    var carErrorType = me.data.carErrorTypeArray[index].label;
    var reasonCode = me.data.carErrorTypeArray[index].id;
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchAbnormal/dispatchAbnormal'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      me.setData({
        carErrorType: carErrorType,
        carErrorTypeIndex: index,
        carErrorflag: true,
        carErrorDescription: "请选择描述"
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
            var carErrorDescriptionArray = res.data;
            me.setData({
              carErrorDescriptionArray: carErrorDescriptionArray
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
  changeCarDescription: function (e) {
    debugger
    var me = this;

    var index = e.detail.value;
    var carErrorDescription = me.data.carErrorDescriptionArray[index].label;
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchAbnormal/dispatchAbnormal'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      me.setData({
        carErrorDescription: carErrorDescription,
        carErrorDescriptionIndex: index
      });
    }
  },
  checkCarErrorDescription: function (e){
    debugger
    var me = this;
    var carErrorTypeIndex = me.data.carErrorTypeIndex;
    if (carErrorTypeIndex == null || carErrorTypeIndex == ''
      || carErrorTypeIndex == undefined) {
      wx.showToast({
        title: '请选择车辆异常登记类型',
        icon: "none"
      })
      return;
    }
  },
  changeOrderErrorType: function (e) {
    var me = this;
    var serverUrl = app.serverUrl;
    var index = e.detail.value;
    var orderErrorType = me.data.orderErrorTypeArray[index].label;
    var reasonCode = me.data.orderErrorTypeArray[index].id;
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchAbnormal/dispatchAbnormal'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      me.setData({
        orderErrorType: orderErrorType,
        orderErrorTypeIndex: index,
        orderErrorflag: true,
        orderErrorDescription: "请选择描述"
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
            var orderErrorDescriptionArray = res.data;
            me.setData({
              orderErrorDescriptionArray: orderErrorDescriptionArray
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
  changeOrderErrorDescription: function (e) {
    var me = this;

    var index = e.detail.value;
    var orderErrorDescription = me.data.orderErrorDescriptionArray[index].label;
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchAbnormal/dispatchAbnormal'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      me.setData({
        orderErrorDescription: orderErrorDescription,
        orderErrorDescriptionIndex:index
      });
    }
  },
  checkOrderErrorDescription: function (e) {
    var me = this;
    var orderErrorTypeIndex = me.data.orderErrorTypeIndex;
    if (orderErrorTypeIndex == null || orderErrorTypeIndex == ''
      || orderErrorTypeIndex == undefined) {
      wx.showToast({
        title: '请选择订单异常登记类型',
        icon: "none"
      })
      return;
    }
  },
  bindWordLimit:function(e){
    var me = this;
    var textareaInput = e.detail.value;
    me.setData({
      textareaInput: textareaInput
    })
  },
  submitCarError: function (e) {
    var me = this;
    var serverUrl = app.serverUrl;
    var description = me.data.textareaInput
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchAbnormal/dispatchAbnormal'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      //获取异常类型
      var carErrorTypeIndex = me.data.carErrorTypeIndex;
      if (carErrorTypeIndex == null || carErrorTypeIndex == '' 
        || carErrorTypeIndex == undefined) {
        wx.showToast({
          title: '选择车辆异常类型',
          icon: "none",
          duration: 2000
        })
        return;
      }
      var carErrorType = me.data.carErrorTypeArray[carErrorTypeIndex].id;

      //获取异常描述
      var carErrorDescriptionIndex = me.data.carErrorDescriptionIndex;
      if (carErrorDescriptionIndex == null || carErrorDescriptionIndex == ''
        || carErrorDescriptionIndex == undefined) {
        wx.showToast({
          title: '选择车辆异常描述',
          icon: "none",
          duration: 2000
        })
        return;
      }
      var carErrorDescription = me.data.carErrorDescriptionArray[carErrorDescriptionIndex].id;

      //获取当前操作订单ID
      var taskId = me.data.taskId;
      var dispatchId = me.data.dispatchOrderlist[taskId].id;
      var departStatus = me.data.dispatchOrderlist[taskId].departStatus;
      wx.showLoading({
        title: '请等待,加载中....',
      })
      //TODO 请求到接口
      wx.request({
        url: serverUrl + '/api/ots/wx/errorRegister',
        method: "POST",
        data: {
          reasonCode: carErrorType,
          reasonContent: carErrorDescription,
          description: description,
          dispatchId: dispatchId,
          departStatus: departStatus
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
              showCar: false
            })
          }else{
            wx.hideLoading();
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
  submitOrderError:function(e){
    debugger
    var me = this;
    var serverUrl = app.serverUrl;
    var description = me.data.textareaInput
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchAbnormal/dispatchAbnormal'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      //获取异常类型
      var orderErrorTypeIndex = me.data.orderErrorTypeIndex;
      if (orderErrorTypeIndex == null || orderErrorTypeIndex == '' 
        || orderErrorTypeIndex == undefined) {
        wx.showToast({
          title: '请选择订单异常类型',
          icon: "none",
          duration: 2000
        })
        return;
      }
      var orderErrorType = me.data.orderErrorTypeArray[orderErrorTypeIndex].id;

      //获取异常描述
      var orderErrorDescriptionIndex = me.data.orderErrorDescriptionIndex;
      if (orderErrorDescriptionIndex == null || orderErrorDescriptionIndex == ''
        || orderErrorDescriptionIndex == undefined) {
        wx.showToast({
          title: '请选择订单异常描述',
          icon: "none",
          duration: 2000
        })
        return;
      }
      var orderErrorDescription = me.data.orderErrorDescriptionArray[orderErrorDescriptionIndex].id;
  
      //获取当前操作订单ID
      var taskId = me.data.taskId;
      var dispatchId = me.data.dispatchOrderlist[taskId].id;
      var departStatus = me.data.dispatchOrderlist[taskId].departStatus;
      wx.showLoading({
        title: '请等待,加载中....',
      })

      //TODO 请求到接口
      wx.request({
        url: serverUrl + '/api/ots/wx/errorRegister',
        method: "POST",
        data: {
          reasonCode: orderErrorType,
          reasonContent: orderErrorDescription,
          description: description,
          dispatchId: dispatchId,
          departStatus: departStatus
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
              showOrder: false
            })
          }else{
            wx.hideLoading();
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
        var realUrl = '../dispatchAbnormal/dispatchAbnormal'
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
                var orderCode = res.data.data.taskTranSportHeader.orderCode;
                dispatchOrderlist.push(res.data.data.dispatchOrder);
                transportOrderlist.push(res.data.data.taskTranSportHeader);
                me.setData({
                  dispatchOrderlist: dispatchOrderlist,
                  transportOrderlist: transportOrderlist,
                  dispatchOrderName: orderId,
                  transportOrderName: orderCode
                })
              }
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
  }
})
