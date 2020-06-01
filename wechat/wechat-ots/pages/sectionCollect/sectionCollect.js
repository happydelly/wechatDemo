//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    transportDetailList:[],
    isExist: true,
    sectionCollectTypeIndex:'',
    sectionCollectDescriptionIndex:'',
    sectionCollectTypeArray: [],
    sectionCollectDescriptionArray:[],
    sectionCollectType: "请选择类型",
    sectionCollectDescription: "请选择描述",
    sectionCollectQty:'',
    typeColor:'',
    descriptionColor:'',
    sectionCollectflag: false,
    taskId: [],
    taskStatus: '',
    transportDetailInfo: ''
  },
  onLoad(params){
    var me = this;
    var serverUrl = app.serverUrl;
    var user = app.getGlobalUserInfo();
    //获取上一个页面传入的参数
    var transportDetailInfo = JSON.parse(params.transportDetailInfo);
    var taskid = transportDetailInfo.id; //获取运输单ID
    var taskStatus = transportDetailInfo.taskStatus //获取运输单状态
    me.setData({
      taskId:[taskid],
      taskStatus: taskStatus,
      transportDetailInfo :params.transportDetailInfo
    })
    var realUrl = '../sectionCollect/sectionCollect#transportDetailInfo@' + params.transportDetailInfo
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
        if (!res.data.error) {
          var transportDetailList = res.data.data;
          me.setData({
            transportDetailList: transportDetailList
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
                var sectionCollectTypeArray = res.data;
                me.setData({
                  sectionCollectTypeArray: sectionCollectTypeArray
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
        }else if(res.data.parameters[0] == 502){
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
  },
  changeSectionCollectType: function (e) {
    var me = this;
    var serverUrl = app.serverUrl;
    var index = e.detail.value;
    var sectionCollectType = me.data.sectionCollectTypeArray[index].label;
    var reasonCode = me.data.sectionCollectTypeArray[index].id;
    var user = app.getGlobalUserInfo();
    var realUrl = '../sectionCollect/sectionCollect#transportDetailInfo@' + me.data.transportDetailInfo
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      me.setData({
        sectionCollectType: sectionCollectType,
        sectionCollectTypeIndex: index,
        typeColor:'black',
        sectionCollectflag: true,
        sectionCollectDescription: "请选择描述"
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
            var sectionCollectDescriptionArray = res.data;
            me.setData({
              sectionCollectDescriptionArray: sectionCollectDescriptionArray
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
  changeSectionCollectDescription: function (e) {
    var me = this;

    var index = e.detail.value;
    var sectionCollectDescription = me.data.sectionCollectDescriptionArray[index].label;
    var user = app.getGlobalUserInfo();
    var realUrl = '../sectionCollect/sectionCollect#transportDetailInfo@' + me.data.transportDetailInfo
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      me.setData({
        sectionCollectDescription: sectionCollectDescription,
        sectionCollectDescriptionIndex: index,
        descriptionColor:'black'
      });
    }
  },
  checkSectionCollectDescription: function (e) {
    var me = this;
    var sectionCollectTypeIndex = me.data.sectionCollectTypeIndex;
    if (sectionCollectTypeIndex == null || sectionCollectTypeIndex == ''
      || sectionCollectTypeIndex == undefined) {
      wx.showToast({
        title: '请选择拒收类型',
        icon: "none"
      })
      return;
    }
  },
  bindWordLimit: function (e) {
    var me = this;
    var textareaInput = e.detail.value;
    me.setData({
      textareaInput: textareaInput
    })
  },
  closeSectionCollect: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  onChangeSectionCollect:function(e){
    var me = this;

    var arrindex = e.currentTarget.dataset.arrindex;
    var transportDetailList = me.data.transportDetailList;
    var transportDetailInfo = transportDetailList[arrindex];
    var sectionCollectQty = e.detail
    transportDetailInfo.rejectQty = sectionCollectQty
    transportDetailList[arrindex] = transportDetailInfo
    me.setData({
      sectionCollectQty: sectionCollectQty,
      transportDetailList: transportDetailList
    })
  },
  submitSectionCollect:function(e){
    var me = this;
    var serverUrl = app.serverUrl;
    var rejectQtyFlag = true;
    var errorMsgFlag = false;
    var transportDetailList = me.data.transportDetailList;
    var taskStatus = me.data.taskStatus;
    var obj = {};
    var user = app.getGlobalUserInfo();
    var realUrl = '../sectionCollect/sectionCollect#transportDetailInfo@' + me.data.transportDetailInfo
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

      for(var i = 0; i < transportDetailList.length; i++){
        var transportDetailInfo = transportDetailList[i];

        //清空错误信息
        transportDetailInfo.errorMsg = "";
        transportDetailList[i] = transportDetailInfo;
        me.setData({
          transportDetailList: transportDetailList
        })

        //校验信息
        var rejectQty = transportDetailList[i].rejectQty;
        var actQty = transportDetailList[i].actQty;
        var id = transportDetailList[i].id;
        var taskId = transportDetailList[i].taskId;

        var isNum = app.isNum;
        if(!isNum.test(rejectQty)){
          errorMsgFlag = true
          receiptDetailInfo.errorMsg = "请填写正确的数字"
        }
        
        if(rejectQty == null || rejectQty == '' || rejectQty == undefined){
          errorMsgFlag = true
          transportDetailInfo.errorMsg = "拒收数量不能为空"
        }
        if(rejectQty > actQty){
          errorMsgFlag = true
          transportDetailInfo.errorMsg = "拒收数量不能大于实际数量"
        }
        if(errorMsgFlag){
          transportDetailList[i] = transportDetailInfo  
          me.setData({
            transportDetailList: transportDetailList
          })
        }
        if(rejectQty > 0){
          rejectQtyFlag = false
        }
        var propertiesMap = {}
        propertiesMap = {"id":id,"rejectQty":rejectQty,"taskId":taskId};
        obj[id] = propertiesMap
      }
      if(errorMsgFlag){
        return;
      }
      if(rejectQtyFlag){
        wx.showToast({
          title: '不能全部拒收数量为0,请修改!!',
          icon: "none",
          duration: 2000
        })
        return;
      }
      
      //获取拒收类型
      var sectionCollectTypeIndex = me.data.sectionCollectTypeIndex;
      if(sectionCollectTypeIndex == null || sectionCollectTypeIndex == '' 
      || sectionCollectTypeIndex == undefined){
        wx.showToast({
          title: '请选择拒收类型',
          icon: "none",
          duration: 2000
        })
        return;
      }
      var sectionCollectType = me.data.sectionCollectTypeArray[sectionCollectTypeIndex].id;

      //获取拒收描述
      var sectionCollectDescriptionIndex = me.data.sectionCollectDescriptionIndex;
      if(sectionCollectDescriptionIndex == null || sectionCollectDescriptionIndex == '' 
      || sectionCollectDescriptionIndex == undefined){
        wx.showToast({
          title: '请选择拒收描述',
          icon: "none",
          duration: 2000
        })
        return;
      }
      var sectionCollectDescription = me.data.sectionCollectDescriptionArray[sectionCollectDescriptionIndex].id;

      var description = me.data.textareaInput;
      
      wx.showLoading({
        title: '请等待,加载中....',
      })
      wx.request({
        url: serverUrl + '/api/ots/wx/transportRejection',
        method: "POST",
        data: obj,
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
            wx.request({
              url: serverUrl + '/api/ots/wx/batchErrorRegister',
              method: "POST",
              data: {
                reasonCode: sectionCollectType,
                reasonContent: sectionCollectDescription,
                description: description,
                ids: me.data.taskId,
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
                  wx.navigateBack({
                    delta: 1
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
  }
})
