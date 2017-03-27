<style lang="sass">
@import '../assets/scss/base'
// @import '../assets/scss/mixins/font-face'
// @include font-face('../assets/fonts/', '5rl6ly')

// @import '../assets/scss/mixins/autoCalcFz'
// @include autoCalcFz

html
  max-width: 640px
  margin: 0 auto
  background-color: #fff

[v-cloak]
  display: none
</style>

<template lang="jade">
keep-alive
  router-view
</template>

<script>
import 'utils/resize'

export default {
  name: 'app'
}
</script>
