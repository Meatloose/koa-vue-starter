import wx from 'wx'

export default (jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideOptionMenu', 'showOptionMenu']) => config => new Promise((resolve, reject) => {
  const CONFIG = {
    ...{debug: process.env.NODE_ENV !== 'production'},
    ...config,
    ...{jsApiList}
  }

  wx.config(CONFIG)
  setTimeout(resolve, 100)
})
