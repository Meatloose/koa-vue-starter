<style lang="sass">
@import '../../assets/scss/mixins/size'
@import '../../assets/scss/functions/px2rem'

.backTop
  @extend %t-a-c
  border-radius: px2rem(30)
  @extend %pos-f
  // bottom: px2rem(20)
  right: px2rem(20)
  z-index: 10
  background-color: rgba(0, 0, 0, .3)
  color: #fff
  @include size(60)
  svg
    @include size(46)
    @extend  %pos-r
    vertical-align: baseline
    top: -.1rem
  p
    font-size: px2rem(18)
    margin-top: -1rem
</style>

<template lang="jade">
div.backTop(v-show="show", @click="scrollTop(step)", :style="{ bottom: bottom }")
  Icon(symbol="arrow-up")
  p TOP
</template>

<script>
import Icon from 'components/common/Icon'
import scrollTop from 'utils/scrollTop'
import throttle from 'utils/throttle'
import 'assets/icons/arrow-up.svg'

export default {
  props: {
    step: {
      type: Number,
      default: 50
    },
    position: {
      type: Number,
      default: 20
    }
  },

  data () {
    return {
      show: false
    }
  },

  components: {
    Icon
  },

  created () {
    window.document.addEventListener('scroll', throttle(() => {
      const scroll = document.documentElement.scrollTop || document.body.scrollTop
      if (scroll > 1500) this.show = true
      else this.show = false
    }, 500), false)
  },

  methods: {
    scrollTop
  },

  computed: {
    bottom () {
      return `${this.position / 32}rem`
    }
  }
}
</script>
