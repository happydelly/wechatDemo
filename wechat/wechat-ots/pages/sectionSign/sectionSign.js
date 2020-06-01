//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    receiptDetailList:[],
    isExist: true,
    sectionSignTypeIndex:'',
    sectionSignDescriptionIndex:'',
    sectionSignTypeArray: [],
    sectionSignDescriptionArray:[],
    sectionSignType: "请选择类型",
    sectionSignDescription: "请选择描述",
    sectionSignQty:'',
    typeColor:'',
    descriptionColor:'',
    sectionSignflag: false,
    receiptId: [],
    receiptStatus:'',
    receiptDetailInfo:''
  },
  onLoad(params){
    var me = this;
    var serverUrl = app.serverUrl;
    var user = app.getGlobalUserInfo();
    //获取上一个页面传入的参数
    var receiptDetailInfo = JSON.parse(params.receiptDetailInfo);
    var receiptid = receiptDetailInfo.id; //获取回单ID
    var receiptStatus = receiptDetailInfo.receiptStatus //获取回单状态
    me.setData({
      receiptId:[receiptid],
      receiptStatus: receiptStatus,
      receiptDetailInfo: params.receiptDetailInfo
    })
    wx.request({
      url: serverUrl + '/api/ots/sync/findReceiptDetailById?id=' + receiptid,
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
          var receiptDetailList = res.data.data;
          me.setData({
            receiptDetailList: receiptDetailList
          })
          var recordType = 'TMS_REJECT_TYPE';
          wx.request({
            url: serverUrl + '/api/ots/sync/loadDataFilterSelectByRecordType',
            method: "POST",
            data: {
              recordType: recordType
            },
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
                var sectionSignTypeArray = res.data;
                me.setData({
                  sectionSignTypeArray: sectionSignTypeArray
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
  changeSectionSignType: function (e) {
    var me = this;
    var serverUrl = app.serverUrl;
    var index = e.detail.value;
    var sectionSignType = me.data.sectionSignTypeArray[index].label;
    var reasonCode = me.data.sectionSignTypeArray[index].id;
    var user = app.getGlobalUserInfo();
    var realUrl = '../sectionSign/sectionSign#receiptDetailInfo@' + me.data.receiptDetailInfo;
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      me.setData({
        sectionSignType: sectionSignType,
        sectionSignTypeIndex: index,
        typeColor:'black',
        sectionSignflag: true,
        sectionSignDescription: "请选择描述",
        descriptionColor: 'var(--cell-value-color,#969799)'
      });

      wx.request({
        url: serverUrl + '/api/ots/sync/loadDataFilterSelectByReasonCode',
        method: "POST",
        data: {
          reasonCode: reasonCode
        },
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
          console.log(res.data)
          if (!res.data.error) {
            var sectionSignDescriptionArray = res.data;
            me.setData({
              sectionSignDescriptionArray: sectionSignDescriptionArray
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
  changeSectionSignDescription: function (e) {
    var me = this;

    var index = e.detail.value;
    var sectionSignDescription = me.data.sectionSignDescriptionArray[index].label;
    var user = app.getGlobalUserInfo();
    var realUrl = '../sectionSign/sectionSign#receiptDetailInfo@' + me.data.receiptDetailInfo;
    if (user == null || user == undefined || user == '') {
      wx.redirectTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    }else{
      me.setData({
        sectionSignDescription: sectionSignDescription,
        sectionSignDescriptionIndex: index,
        descriptionColor:'black'
      });
    }
  },
  checkSectionSignDescription: function (e) {
    var me = this;
    var sectionSignTypeIndex = me.data.sectionSignTypeIndex;
    if (sectionSignTypeIndex == null || sectionSignTypeIndex == ''
      || sectionSignTypeIndex == undefined) {
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
  closeSectionSign: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  onChangeSectionSign:function(e){
    var me = this;
    var arrindex = e.currentTarget.dataset.arrindex;
    var receiptDetailList = me.data.receiptDetailList;
    var receiptDetailInfo = receiptDetailList[arrindex];
    var sectionSignQty = e.detail
    receiptDetailInfo.rejectQty = sectionSignQty
    receiptDetailList[arrindex] = receiptDetailInfo
    me.setData({
      sectionSignQty: sectionSignQty,
      receiptDetailList: receiptDetailList
    })
  },
  submitSectionSign:function(e){
    var me = this;
    var serverUrl = app.serverUrl;
    var rejectQtyFlag = true;
    var errorMsgFlag = false;
    var receiptDetailList = me.data.receiptDetailList;
    var receiptStatus = me.data.receiptStatus;
    var obj = {};
    var user = app.getGlobalUserInfo();
    var realUrl = '../sectionSign/sectionSign#receiptDetailInfo@' + me.data.receiptDetailInfo;
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
      debugger
      for(var i = 0; i < receiptDetailList.length; i++){
        var receiptDetailInfo = receiptDetailList[i];

        //清空错误信息
        receiptDetailInfo.errorMsg = "";
        receiptDetailList[i] = receiptDetailInfo;
        me.setData({
          receiptDetailList: receiptDetailList
        })

        //校验信息
        var rejectQty = receiptDetailList[i].rejectQty;
        var actQty = receiptDetailList[i].actQty;
        var id = receiptDetailList[i].id;
        var receiptId = receiptDetailList[i].receiptId;
        
        var isNum = app.isNum;
        if(!isNum.test(rejectQty)){
          errorMsgFlag = true
          receiptDetailInfo.errorMsg = "请填写正确的数字"
        }

        if(rejectQty == null || rejectQty == '' || rejectQty == undefined){
          errorMsgFlag = true
          receiptDetailInfo.errorMsg = "拒收数量不能为空"
        }
        if(rejectQty > actQty){
          errorMsgFlag = true
          receiptDetailInfo.errorMsg = "拒收数量不能大于实际数量"
        }
        if(errorMsgFlag){
          receiptDetailList[i] = receiptDetailInfo  
          me.setData({
            receiptDetailList: receiptDetailList
          })
        }
        if(rejectQty > 0){
          rejectQtyFlag = false
        }
        var propertiesMap = {}
        propertiesMap = {"id":id,"rejectQty":rejectQty,"receiptId":receiptId};
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
      var sectionSignTypeIndex = me.data.sectionSignTypeIndex;
      if(sectionSignTypeIndex == null || sectionSignTypeIndex == '' 
      || sectionSignTypeIndex == undefined){
        wx.showToast({
          title: '请选择拒收类型',
          icon: "none",
          duration: 2000
        })
        return;
      }
      var sectionSignType = me.data.sectionSignTypeArray[sectionSignTypeIndex].id;

      //获取拒收描述
      var sectionSignDescriptionIndex = me.data.sectionSignDescriptionIndex;
      if(sectionSignDescriptionIndex == null || sectionSignDescriptionIndex == '' 
      || sectionSignDescriptionIndex == undefined){
        wx.showToast({
          title: '请选择拒收描述',
          icon: "none",
          duration: 2000
        })
        return;
      }
      var sectionSignDescription = me.data.sectionSignDescriptionArray[sectionSignDescriptionIndex].id;

      var description = me.data.textareaInput;

      wx.showLoading({
        title: '请等待,加载中....',
      })

      wx.request({
        url: serverUrl + '/api/ots/sync/receiptRejection',
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
              url: serverUrl + '/api/ots/sync/batchErrorRegister',
              method: "POST",
              data: {
                reasonCode: sectionSignType,
                reasonContent: sectionSignDescription,
                description: description,
                ids: me.data.receiptId,
                typeCode: "receipt"
              },
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
  }
})
