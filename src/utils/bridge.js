class NativeAPI {
  constructor () {
    NativeAPI.init(this)
    .catch(() => console.log('NativeAPIInitError---> CAN NOT INIT WEBVIEW BRIDGE'))
  }

  static init (origin) {
    return new Promise((resolve, reject) => {
      const clearTimer = () => {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
      }

      const removeListener = () => {
        document.removeEventListener('WebViewJavascriptBridgeReady', this.listener, true)
      }

      const resolved = () => {
        this.inited = true
        origin.ABLE = true
        clearTimer()
        resolve(this.bridge)
      }

      const rejected = () => {
        this.inited = true
        origin.ABLE = false
        clearTimer()
        if (this.listener) removeListener()
        reject()
      }

      if (this.inited) {
        if (this.bridge) resolved()
        else rejected()
      }

      this.timer = setTimeout(rejected, 2000)

      // android
      if (window.webViewBridge) {
        this.bridge = window.webViewBridge

        this.bridge.registerHandler = (method, fn) => {
          window.webViewBridge[method] = fn
        }
        this.bridge.callHandler = (method, data, fn) => {
          // 为匿名回调函数随机生成一个函数名
          const callback = `callback_${Math.random().toString(36).substr(2, 15)}`

          this.bridge[callback] = fn
          // 给android把随机的函数名传过去， 以便android调用
          this.bridge[method](JSON.stringify(data), callback)
        }
        resolved()

      // ios
      } else if (window.WebViewJavascriptBridge) {
        this.bridge = window.WebViewJavascriptBridge
        resolved()
      } else {
        this.listener = () => {
          this.bridge = window.WebViewJavascriptBridge
          this.bridge.init()
          removeListener()
          resolved()
        }
        document.addEventListener('WebViewJavascriptBridgeReady', this.listener, true)
      }
    })
  }

  check () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.ABLE) resolve()
        else reject()
      }, 500)
    })
  }

  retry () {
    return new Promise((resolve, reject) => {
      NativeAPI.init(this)
      .then(resolve)
      .catch(reject)
    })
  }

  invoke (method, data = {}) {
    return new Promise((resolve, reject) => {
      NativeAPI.init(this)
      .then(bridge => {
        bridge.callHandler(`${method}ToApp`, {data}, resolve)
      })
      .catch(reject)
    })
  }

  execute (method, fn) {
    return new Promise((resolve, reject) => {
      NativeAPI.init(this)
      .then(bridge => {
        bridge.registerHandler(`${method}ToWap`, () => {
          fn()
          resolve()
        })
      })
      .catch(reject)
    })
  }
}

export default new NativeAPI()
