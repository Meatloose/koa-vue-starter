<template lang="jade">
picture
  source(v-for="(src, type) in srcset", :key="src", :srcset="src", :type="[`image/${type}`]")
  img(v-if="lazyLoadAble", :src="srcset[ext]", v-img-lazy-load="update")
  img(v-else, :src="srcset[ext]")
</template>

<script>
import imgLazyLoad from 'directives/imgLazyLoad'

export default {
  props: {
    set: {
      type: Object,
      required: false
    },
    lazyLoadAble: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      srcset: null,
      ext: ''
    }
  },

  created () {
    const { lazyLoadAble, update } = this
    if (lazyLoadAble) {
      this.srcset = {
        webp: require('assets/images/common/placeholder.webp'),
        png: require('assets/images/common/placeholder.png')
      }
      this.ext = 'png'
    } else {
      update()
    }
  },

  directives: {
    imgLazyLoad
  },

  methods: {
    update () {
      const { set } = this

      if (!set) return

      const EXT = Object.keys(set).filter(type => type !== 'webp').join('')

      this.ext = EXT === 'jpg' ? 'jpeg' : EXT

      this.srcset = this.set

      return this.srcset[this.ext]
    }
  }
}
</script>
