//index.js
const app = getApp()
const { defaultCity, defaultCounty } = app.globalData;
Page({
  data: {
    imgUrls: [
      '../../images/n1.jpg',
      '../../images/n2.jpg',
      '../../images/n3.jpg'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    currentLocaion: app.globalData.defaultCity + '' + app.globalData.defaultCounty,
  },

  onLoad: function() {
    console.log('执行了load')
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      this.getLocation();

                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          this.getLocation();
        }
        else {
          //调用wx.getLocation的API
          this.getLocation();
        }
      }
    })
  },
  getLocation(){
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: res=> {
        var longitude = res.longitude
        var latitude = res.latitude;
        this.localCity(longitude, latitude);
       },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  localCity(longitude, latitude){
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${app.globalData.tencentMapKey}`,
      success: res => {
        app.globalData.defaultCity = defaultCity ? defaultCity : res.data.result.ad_info.city;
        app.globalData.defaultCounty = defaultCounty ? defaultCounty : res.data.result.ad_info.district;
        this.setData({
          currentLocaion: app.globalData.defaultCity + '' + app.globalData.defaultCounty,
        });
        // 获取天气
        // that.getWeather();
        // that.getAir();
      }
    })
  },
  switchCity(){
    wx.navigateTo({
      url: '../switchCity/switchCity'
    })
  }


})
