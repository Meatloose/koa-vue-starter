<style lang="sass">
@import '../../assets/scss/components/popup'
</style>

<template lang="jade">
div.mask.active(:class="{'mask-transparent': !!options.transparent}")
  div.popup
    div.popup-header {{ options.title }}
    div.popup-body {{ options.content }}
    div.popup-footer
      a#cancelButton.popup-cancel(v-if="options.type === 'confirm'") {{ options.cancelButton }}
      a#confirmButton(:class="['popup-' + options.type ]") {{ options.confirmButton }}
</template>

<script>
export default {
  /**
   * [弹出模态框可选配置项]
   * @param type [String] 弹出框类型 'alert' || 'confirm'
   * @param transparent [Boolean] 遮罩层是否透明
   * @param title [String] 弹出框标题
   * @param *content [String] 弹出框主体内容
   * @param cancelButton [String] 弹出框取消按钮名称
   * @param confirmButton [String] 弹出框确认按钮名称
   */
  props: {
    options: {
      type: Object,
      required: true
    }
  },

  methods: {
    dispathAndClose (event) {
      this.$dispatch(event)
    }
  }
}
</script>
