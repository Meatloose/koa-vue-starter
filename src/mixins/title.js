import wechatCheck from 'utils/wechatCheck'

export default {
  created () {
    setTimeout(() => {
      document.title = this.title

      const body = document.body

      if (wechatCheck) {
        // 利用iframe的onload事件刷新页面
        const iframe = document.createElement('iframe')
        iframe.src = '//m.womai.com/images/favicon.ico'
        iframe.style.visibility = 'hidden'
        iframe.style.width = '0'
        iframe.style.height = '0'
        iframe.onload = () => {
          setTimeout(() => {
            body.removeChild(iframe)
          }, 0)
        }
        body.appendChild(iframe)
      }
    }, 0)
  }
}
