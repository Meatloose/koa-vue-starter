import ios from 'utils/IOSCheck'
import wechat from 'utils/wechatCheck'

export default {
  created () {
    if (wechat) return

    const { nativeApiCheck, nativeApiRetry, nativeAble } = this
    const checker = () => ios && !nativeAble && nativeApiRetry()

    nativeApiCheck()
    setTimeout(checker, 4000)
  }
}
