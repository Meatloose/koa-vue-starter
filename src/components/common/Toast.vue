<style lang="sass">
@import '../../assets/scss/variables/variables'

.toast
  @extend %pos-f
  top: 35%
  left: 50%
  margin-left: -30.75%
  width: 60.5%
  border-radius: .3rem
  background-color: rgba(0, 0, 0, .6)
  box-shadow: 0 0 6px rgba(0, 0, 0, .6)
.toast-content
  padding: .5rem 1rem
  color: #fff
  font-size: .8rem
  @extend %t-a-c
</style>

<template lang="jade">
div.toast
  div.toast-content {{ content }}
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    }
  }
}
</script>
