<style scoped lang="sass">
@import '../../assets/scss/components/loading-indicator'
</style>

<template lang="jade">
div.indicator.text.a-c(:class="{ fix-bottom: position }", :style="{ height: `${indicateOffset}px` }")
  div.indicator-content
    span(:style="{ transform: `rotate(${deg})` }", :class="{ spinner: indicateState === 'loading' }")
      icon(symbol="refresh2")
    |  {{ state }}...
</template>

<script>
import Icon from 'components/common/Icon'
import 'assets/icons/refresh2.svg'

export default {
  data () {
    return {
      move: '下拉即可刷新',
      release: '释放即可刷新',
      loading: '努力的加载中'
    }
  },
  /**
   * [Loading Indicator 组件可选配置项]
   * @param *indicate-offset [String] 下拉长度
   * @param *indicate-state [String] 拉动状态
   * @param position [String] 定位
   */
  props: ['indicate-Offset', 'indicateProcess', 'position'],

  components: {
    Icon
  },

  computed: {
    state () {
      return this[this['indicateProcess']]
    },

    deg () {
      return `${(1 - this.indicateOffset / 2) * 7}deg`
    }
  }
}
</script>
