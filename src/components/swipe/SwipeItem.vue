<template lang="jade">
div.swipe-item
  a(:href="item.link")
    img(:src="item.src", :alt="item.alt")
</template>

<script>
export default {
  props: ['item', 'swipeItemCreated', 'swipeItemDestroyed'],

  mounted () {
    this.swipeItemCreated()
  },

  beforeDestroy () {
    this.swipeItemDestroyed()
  },

  destroyed () {
    this.swipeItemDestroyed()
  }
}
</script>
