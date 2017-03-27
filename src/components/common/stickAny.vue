<style lang="sass">
@import '../../assets/scss/mixins/full-fill-img'

.stick-any
  position: fixed
  z-index: 10
  img
    @include full-fill-img()
</style>

<template lang="jade">
div.stick-any(v-show="show", @click="scrollTop(step, to)")
  img(:src="el")
</template>

<script>
import scrollTop from 'utils/scrollTop'
import throttle from 'utils/throttle'
import 'assets/icons/arrow-up.svg'

export default {
  props: {
    step: {
      type: Number,
      default: 50
    },
    el: {
      type: String
    },
    to: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      show: false
    }
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
  }
}
</script>
