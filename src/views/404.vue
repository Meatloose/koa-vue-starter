<style lang="sass">
@import '../assets/scss/variables/variables'
@import '../assets/scss/mixins/center'

.no-found
  @include center()
  @extend %t-a-c

h1
  font-size: 4rem

h5
  color: gray
</style>

<template lang="jade">
section.no-found
  h1 404
  h5 咦？这个页面被吃掉了…
</template>

<script>
import title from 'mixins/title'

export default {
  name: '404',

  mixins: [title],

  data () {
    return {
      title: '404'
    }
  }
}
</script>
