<style lang="sass">
.Icon
  display: inline-block
  stroke-width: 0
  stroke: currentColor
  fill: currentColor
  vertical-align: middle
</style>

<template lang="jade">
svg.Icon
  use(:xlink:href="['#' + symbol]")
</template>

<script>
export default {
  props: ['symbol']
}
</script>
