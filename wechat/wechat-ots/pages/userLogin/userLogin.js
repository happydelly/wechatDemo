//获取应用实例
const app = getApp()
Page({
  data: {
    phone: '',
    captcha: '',
    smsMsg: '获取验证码',
    smsMsgWait: 10
  },
  onLoad(params){
    var me = this
    var redirectUrl = params.redirectUrl;
    if (redirectUrl != null && redirectUrl != undefined && redirectUrl != '') {
      redirectUrl = redirectUrl.replace(/#/g, "?");
      redirectUrl = redirectUrl.replace(/@/g, "=");

      me.redirectUrl = redirectUrl;
    }
  },
  onChangePhone: function (e) {
    var me = this;
    var phone = e.detail
    me.setData({
      phone: phone
    })
  },
  onChangeCaptcha: function (e) {
    var me = this;
    var captcha = e.detail
    me.setData({
      captcha: captcha
    })
  },
  getCaptcha: function(e){
    var me = this;
    
    var phone = me.data.phone;
    if(phone == null || phone == undefined || phone == ''){
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var isPhone = app.isPhone;
    if(!isPhone.test(phone)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    // 60秒后重新获取验证码
    var inter = setInterval(function() {
      me.setData({
        smsFlag: true,
        smsMsg: me.data.smsMsgWait + 's后重发',
        smsMsgWait: me.data.smsMsgWait - 1
      });
      if (me.data.smsMsgWait < 0) {
        clearInterval(inter)
        me.setData({
          smsMsg: '获取验证码',
          smsMsgWait: 10,
          smsFlag: false
        });
      }
    }.bind(this), 1000);

    wx.showLoading({
      title: '请等待,加载中....',
    })
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl + '/api/ots/wx/getCaptcha?phone='+phone,
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
      success: function(res){
        wx.hideLoading();
        console.log(res.data)
        if(!res.data.error){
          wx.showToast({
            title: '验证码发送成功',
            icon: 'success',
            duration: 2000
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
  },
  login: function(e){
    var me = this
    var serverUrl = app.serverUrl;
    var phone = me.data.phone;
    if(phone == null || phone == undefined || phone == ''){
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var isPhone = app.isPhone;
    if(!isPhone.test(phone)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var captcha = me.data.captcha;
    if(captcha == null || captcha == undefined || captcha == ''){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var isCaptcha = app.isCaptcha;
    if(!isCaptcha.test(captcha)){
      wx.showToast({
        title: '请输入正确的验证码',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.showLoading({
      title: '请等待,加载中....',
    })
    wx.request({
      url: serverUrl + '/api/ots/wx/login',
      method: "POST",
      data:{
        captcha: captcha,
        mobile: phone
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
      success: function(res){
        wx.hideLoading();
        console.log(res.data)
        if(!res.data.error){
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          })
          app.setGlobalUserInfo(res.data.data);
          // 页面跳转
          debugger
          var redirectUrl = me.redirectUrl;
          if (redirectUrl != null && redirectUrl != undefined && redirectUrl != '') {
            wx.redirectTo({
              url: redirectUrl,
            })
          } else {
            wx.switchTab({
              url: '../mine/mine',
            })
          }
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
  },
  wechatLogin: function (e) {
    var me = this
    wx.getSetting({
      success(res) {
        
        if (res.authSetting['scope.userInfo']) {
          //已经授权,调用获取用户信息
          wx.getUserInfo({
            success:function(res){
              
              var userInfo = res.userInfo
              wx.login({
                success:function(res){
                  var phone = me.data.phone;
                  if(phone == null || phone == undefined || phone == ''){
                    wx.showToast({
                      title: '请输入手机号',
                      icon: 'none',
                      duration: 2000
                    })
                    return;
                  }
                  wx.showLoading({
                    title: '请等待,加载中....',
                  })
                  console.log(res)
                  var serverUrl = app.serverUrl;
                   //获取登录临时凭证 
                  var code = res.code
                  //调用后端,获取微信的session_key,secret
                  wx.request({
                    url: serverUrl+'/api/ots/wx/wxLogin?code=' + code,
                    data:{
                      nickName: userInfo.nickName,
                      faceImage: userInfo.avatarUrl,
                      mobile: phone
                    },
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
                      console.log(res.data)
                      if(!res.data.error){
                        // 登录成功跳转 
                        wx.showToast({
                          title: '登录成功',
                          icon: 'success',
                          duration: 2000
                        });
                        app.setGlobalUserInfo(res.data.data);
                        // 页面跳转
                        debugger
                        var redirectUrl = me.redirectUrl;
                        if (redirectUrl != null && redirectUrl != undefined && redirectUrl != '') {
                          wx.redirectTo({
                            url: redirectUrl,
                          })
                        } else {
                          wx.switchTab({
                            url: '../mine/mine',
                          })
                        }
                      }else{
                          // 失败弹出框
                          wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 3000
                          })
                      }
                      
                    }
                  })
                }
              })
            }
          })
        }else{
          //未进行授权
          wx.showToast({
            title: "请进行授权..",
            duration: 3000,
            icon: "none",
          })
        }
      }
    })
  }
})
