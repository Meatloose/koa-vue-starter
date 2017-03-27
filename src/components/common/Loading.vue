<style lang="sass">
@import '../../assets/scss/components/loading'
</style>

<template lang="jade">
div.mask.active(:class="[!options.content ? 'mask-transparent': '']")
  div.loading
    div.loading-icon
      div.spinner(:class="[(options.color ? 'text-' + options.color : '')]")
        icon(:symbol="'spinner' + (options.style ? '-' + options.style : '')")
    div(v-if="options.content", class="loading-content") {{ options.content }}
</template>

<script>
import Icon from 'components/common/Icon'
import 'assets/icons/spinner.svg'

export default {
  /**
   * [Loading 组件可选配置项]
   * @param options [Object] 配置项
   * @param options.color [String] Loading 组件颜色 默认黑色
   * @param options.style [String] Loading 组件样式 'sun' || 'curve' || 默认
   * @param options.content [String] Loading 组件说明描述性文字
   */
  props: ['options'],

  components: {
    Icon
  }
}
</script>
