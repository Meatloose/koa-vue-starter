<template lang="jade">
div.hide(v-if="wechatSupport")
  slot
</template>

<script>
import WechatSign from 'utils/wechat'
import wechatCheck from 'utils/wechatCheck'

export default {
  /**
   * [WechatShare 微信分享组件可选配置项]
   * @param title [String] 分享标题
   * @param imgUrl [String] 分享图片链接
   * @param desc [String] 分享描述
   * @param link [String] 分享链接
   */
  props: ['shareData', 'keyword'],

  data () {
    return {
      wechatSupport: wechatCheck
    }
  },

  created () {
    if (!wechatCheck) return

    WechatSign(this.keyword).then(wx => {
      const SHAREOPTIONS = {...this.shareData}
      SHAREOPTIONS.imgUrl = window.location.protocol + SHAREOPTIONS.imgUrl

      wx.ready(() => {
        wx.onMenuShareAppMessage(SHAREOPTIONS)
        wx.onMenuShareTimeline(SHAREOPTIONS)
      })
    }).catch(err => console.log('wechatShareError--->', err))
  }
}
</script>
