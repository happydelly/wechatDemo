//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    dispatchOrderName: '',
    activeName: '',
    receiptOrderName:'',
    page: 1,
    dispatchOrderlist:[],
    receiptOrderlist: [],
    platform: '******',
    rejectShow: false,
    rejectType:"请选择类型",
    rejectDescription:"请选择描述",
    rejectTypeIndex:'',
    rejectDescriptionIndex:'',
    rejectTypeArray: [],
    rejectDescriptionArray: [],
    textareaInput:'',
    rejectflag: false,
    taskId: []
  },
  onLoad(){
    var me = this
    //加载构建发车单界面
    me.getAllDispatchOrderList()
  },
  refresh(receiptOrderInfo) {
    var me = this
    setTimeout(function () {
      me.refreshReceiptOrder(receiptOrderInfo)
    }, 2000)
  },
  refreshReceiptOrder(receiptOrderInfo){
    var me = this
    var serverUrl = app.serverUrl;
    var departcode = receiptOrderInfo.departCode

    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchSign/dispatchSign'
    wx.showLoading({
      title: '请等待,加载中....',
    })
    wx.request({
      url: serverUrl + '/api/ots/wx/findReceiptOrder?departCode=' + departcode,
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
          var receiptOrderlist = res.data.data;
          me.setData({
            receiptOrderlist: receiptOrderlist
          })
        } else {
          me.setData({
            receiptOrderlist: []
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
    var realUrl = '../dispatchSign/dispatchSign'
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
      receiptOrderName:""
    });
    
    
    var serverUrl = app.serverUrl;
    var dispatchOrderlist = me.data.dispatchOrderlist;
    var arrindex = event.currentTarget.dataset.arrindex;
    var dispatchOrderInfo = dispatchOrderlist[arrindex];
    var departcode = dispatchOrderInfo.departcode;
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchSign/dispatchSign'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      wx.showLoading({
        title: '请等待,加载中....',
      })
      wx.request({
        url: serverUrl + '/api/ots/wx/findReceiptOrder?departCode=' + departcode,
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
            var receiptOrderlist = res.data.data;
            me.setData({
              receiptOrderlist: receiptOrderlist
            })
          } else {
            me.setData({
              receiptOrderlist: []
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
      receiptOrderName:""
    });
  },
  onOpenReceiptOrder(event){
    this.setData({
      receiptOrderName: event.detail
    });
  },
  onCloseReceiptOrder(event){
    this.setData({
      receiptOrderName: ""
    });
  },
  showReject:function(e){
    var me = this;
    var serverUrl = app.serverUrl;
    var arrindex = e.currentTarget.dataset.arrindex;
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchSign/dispatchSign'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      me.setData({
        rejectShow: true,
        rejectflag: false,
        rejectType: "请选择类型",
        rejectDescription: "请选择描述",
        rejectTypeIndex: "",
        rejectDescriptionIndex: "",
        taskId:[arrindex]
      })

      wx.showLoading({
        title: '请等待,加载中....',
      })

      var recordType = 'TMS_REJECT_TYPE';
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
            var rejectTypeArray = res.data;
            me.setData({
              rejectTypeArray: rejectTypeArray
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
          wx.hideLoading();
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
  closeReject: function(e){
    var me = this;
    me.setData({
      rejectShow: false
    })
  },
  changeRejectType: function (e) {
    var me = this;
    var serverUrl = app.serverUrl;
    var index = e.detail.value;
    var rejectType = me.data.rejectTypeArray[index].label;
    var reasonCode = me.data.rejectTypeArray[index].id;
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchSign/dispatchSign'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      me.setData({
        rejectType: rejectType,
        rejectTypeIndex: index,
        rejectflag: true,
        rejectDescription: "请选择描述"
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
            var rejectDescriptionArray = res.data;
            me.setData({
              rejectDescriptionArray: rejectDescriptionArray
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
          wx.hideLoading();
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
  changeRejectDescription: function (e) {
    var me = this;

    var index = e.detail.value;
    var rejectDescription = me.data.rejectDescriptionArray[index].label;
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchSign/dispatchSign'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      me.setData({
        rejectDescription: rejectDescription,
        rejectDescriptionIndex:index
      });
    }
  },
  checkRejectDescription: function (e) {
    var me = this;
    var rejectTypeIndex = me.data.rejectTypeIndex;
    if (rejectTypeIndex == null || rejectTypeIndex == ''
      || rejectTypeIndex == undefined) {
      wx.showToast({
        title: '请选择拒收类型',
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
  submitReject:function(e){
    debugger
    var me = this;
    var serverUrl = app.serverUrl;
    var description = me.data.textareaInput
    var user = app.getGlobalUserInfo();
    var realUrl = '../dispatchSign/dispatchSign'
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      //获取异常类型
      var rejectTypeIndex = me.data.rejectTypeIndex;
      if (rejectTypeIndex == null || rejectTypeIndex == '' 
        || rejectTypeIndex == undefined) {
        wx.showToast({
          title: '请选择拒收类型',
          icon: "none",
          duration: 2000
        })
        return;
      }
      var rejectType = me.data.rejectTypeArray[rejectTypeIndex].id;
      
      //获取异常描述
      var rejectDescriptionIndex = me.data.rejectDescriptionIndex;
      if (rejectDescriptionIndex == null || rejectDescriptionIndex == ''
        || rejectDescriptionIndex == undefined) {
        wx.showToast({
          title: '请选择拒收描述',
          icon: "none",
          duration: 2000
        })
        return;
      }
      var rejectDescription = me.data.rejectDescriptionArray[rejectDescriptionIndex].id;


      //获取当前操作订单ID
      var taskId = me.data.taskId;
      var id = [me.data.receiptOrderlist[taskId].id];
      wx.showLoading({
        title: '请等待,加载中....',
      })

      //TODO 请求到接口
      wx.request({
        url: serverUrl + '/api/ots/wx/batchErrorRegister',
        method: "POST",
        data: {
          reasonCode: rejectType,
          reasonContent: rejectDescription,
          description: description,
          ids: id,
          typeCode: "receipt"
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
              rejectShow: false
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
          wx.hideLoading();
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
  showReceiptOrderDetail: function (e) {
    var me = this
    var serverUrl = app.serverUrl;
    var receiptOrderlist = me.data.receiptOrderlist;
    var arrindex = e.target.dataset.arrindex;
    var receiptDetailInfo = JSON.stringify(receiptOrderlist[arrindex]);
    var user = app.getGlobalUserInfo();
    var realUrl = '../receiptDetailInfo/receiptDetailInfo#receiptDetailInfo@' + receiptDetailInfo
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      wx.navigateTo({
        url: '../receiptDetailInfo/receiptDetailInfo?receiptDetailInfo=' + receiptDetailInfo,
      })
    }
  },
  signAll: function(e){
    var me = this
    var serverUrl = app.serverUrl;
    wx.showModal({
      title:'是否确认签收?',
      success(res){
        if (res.confirm) {
          debugger
          var receiptOrderlist = me.data.receiptOrderlist;
          var arrindex = e.currentTarget.dataset.arrindex;
          var receiptOrderInfo = receiptOrderlist[arrindex];
          var receiptStatus = receiptOrderInfo.receiptStatus;
          var id = [receiptOrderInfo.id]
          var user = app.getGlobalUserInfo();
          var realUrl = '../dispatchSign/dispatchSign'
          if (user == null || user == undefined || user == '') {
            wx.redirectTo({
              url: '../userLogin/userLogin?redirectUrl=' + realUrl,
            })
          }else{
            if (receiptStatus !== 620) {
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
              url: serverUrl + '/api/ots/wx/batchSignFor',
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
                  me.refresh(receiptOrderInfo)
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
        }else{
          console.log('点击了取消')
        }
        
      }
    })
  },
  sectionSign:function(e){
    var me = this
    var serverUrl = app.serverUrl;
    var receiptOrderlist = me.data.receiptOrderlist;
    var arrindex = e.target.dataset.arrindex;
    var receiptDetailInfo = JSON.stringify(receiptOrderlist[arrindex]);
    var user = app.getGlobalUserInfo();
    var realUrl = '../sectionSign/sectionSign#receiptDetailInfo@' + receiptDetailInfo;
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      wx.navigateTo({
        url: '../sectionSign/sectionSign?receiptDetailInfo=' + receiptDetailInfo,
      })
    }
  },
  receiptOrder:function(e){
    debugger
    var me = this
    var serverUrl = app.serverUrl;
    var receiptOrderlist = me.data.receiptOrderlist;
    var arrindex = e.target.dataset.arrindex;
    var receiptOrderInfo = receiptOrderlist[arrindex];
    wx.navigateTo({
      url: '../dispatchReceiptOrder/dispatchReceiptOrder?receiptOrderInfo=' + receiptOrderInfo,
    })
  },
  scanCode: function (e) {
    var me = this
    var serverUrl = app.serverUrl
    wx.scanCode({
      success: function (res) {
        var scanCode = res.result;
        var user = app.getGlobalUserInfo();
        var realUrl = '../dispatchSign/dispatchSign'
        wx.showLoading({
          title: '请等待,加载中....',
        })
        wx.request({
          url: serverUrl + '/api/ots/wx/findDispatchAndTransportOrderByScanCode?scanCode=' + scanCode,
          method: "POST",
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
                var receiptOrderlist = []
                var orderId = res.data.data.dispatchOrder.id;
                var orderCode = res.data.data.taskTranSportHeader.orderCode;
                dispatchOrderlist.push(res.data.data.dispatchOrder);
                receiptOrderlist.push(res.data.data.taskTranSportHeader);
                me.setData({
                  dispatchOrderlist: dispatchOrderlist,
                  receiptOrderlist: receiptOrderlist,
                  dispatchOrderName: orderId,
                  receiptOrderName: orderCode
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
