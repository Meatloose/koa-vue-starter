<style lang="sass">
@import '../../assets/scss/variables/variables'

.swipe-wrap
  overflow: hidden
  @extend  %pos-r

.swipe-items-wrap
  @extend  %pos-r
  overflow: hidden
  height: 100%
  div
    @extend  %pos-a
    transform: translateX(-100%)
    width: 100%
    height: 100%
    display: none
    &.active
      display: block
      transform: translateX(0)

.swipe-indicators
  @extend  %pos-a
  bottom: 0
  left: 50%
  transform: translateX(-50%)

.swipe-indicator
  width: 8px
  height: 8px
  display: inline-block
  border-radius: 100%
  background: rgba(0, 0, 0, .3)
  margin: 0 3px
  &.active
    background: rgba(48, 152, 13, .8)
</style>

<template lang="jade">
div.swipe-wrap
  div.swipe-items-wrap
    swipe-item(v-for="(item, idx) in items", :item="item", :class="{ active: idx === index }", :swipe-item-created="swipeItemCreated", :swipe-item-destroyed="swipeItemDestroyed")
  div.swipe-indicators(v-if="showIndicators")
    div.swipe-indicator(v-for="(page, idx) in pages", :class="{ active: idx === index }")
</template>

<script>
import SwipeItem from './SwipeItem'
import { addClass, removeClass } from 'utils/domClass'
import { Once } from 'utils/domEvent'

export default {
  created () {
    this.dragState = {}
  },

  data () {
    return {
      ready: false,
      dragging: false,
      userScrolling: false,
      animating: false,
      index: 0,
      pages: [],
      timer: null,
      reInitTimer: null,
      noDrag: false
    }
  },

  components: {
    SwipeItem
  },

  props: {
    items: {
      type: Array,
      required: true
    },
    speed: {
      type: Number,
      default: 300
    },
    auto: {
      type: Number,
      default: 3000
    },
    continuous: {
      type: Boolean,
      default: true
    },
    showIndicators: {
      type: Boolean,
      default: true
    },
    noDragWhenSingle: {
      type: Boolean,
      default: true
    },
    prevent: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    running () {
      if (this.auto > 0) {
        this.timer = setInterval(() => {
          if (!this.dragging && !this.animating) this.next()
        }, this.auto)
      }
    },

    translate (element, offset, speed, callback) {
      if (speed) {
        this.animating = true
        element.style.webkitTransition = `-webkit-transform ${speed}ms ease-in-out`
        setTimeout(() => { element.style.webkitTransform = `translate3d(${offset}px, 0, 0)` }, 50)

        let called = false

        const transitionEndCallback = () => {
          if (called) return
          called = true
          this.animating = false
          element.style.webkitTransition = ''
          element.style.webkitTransform = ''
          if (callback) {
            callback.apply(this, arguments)
          }
        }

        Once(element, 'webkitTransitionEnd', transitionEndCallback)
        // webkitTransitionEnd maybe not fire on lower version android.
        setTimeout(transitionEndCallback, speed + 100)
      } else {
        element.style.webkitTransition = ''
        element.style.webkitTransform = `translate3d(${offset}px, 0, 0)`
      }
    },

    reInitPages () {
      const children = this.$children
      this.noDrag = children.length === 1 && this.noDragWhenSingle

      const pages = []
      this.index = 0

      children.forEach((child, index) => {
        pages.push(child.$el)
      })

      this.pages = pages
    },

    doAnimate (towards, options) {
      if (this.$children.length === 0) return
      if (!options && this.$children.length < 2) return

      let prevPage, nextPage, currentPage, pageWidth, offsetLeft
      const speed = this.speed
      const index = this.index
      const pages = this.pages
      const pageCount = pages.length

      if (!options) {
        pageWidth = this.$el.clientWidth
        currentPage = pages[index]
        prevPage = pages[index - 1]
        nextPage = pages[index + 1]
        if (this.continuous && pages.length > 1) {
          if (!prevPage) prevPage = pages[pages.length - 1]
          if (!nextPage) nextPage = pages[0]
        }
        if (prevPage) {
          prevPage.style.display = 'block'
          this.translate(prevPage, -pageWidth)
        }
        if (nextPage) {
          nextPage.style.display = 'block'
          this.translate(nextPage, pageWidth)
        }
      } else {
        prevPage = options.prevPage
        currentPage = options.currentPage
        nextPage = options.nextPage
        pageWidth = options.pageWidth
        offsetLeft = options.offsetLeft
      }

      let newIndex

      const oldPage = this.$children[index].$el

      if (towards === 'prev') {
        if (index > 0) newIndex = index - 1

        if (this.continuous && index === 0) newIndex = pageCount - 1
      } else if (towards === 'next') {
        if (index < pageCount - 1) newIndex = index + 1

        if (this.continuous && index === pageCount - 1) newIndex = 0
      }

      const callback = () => {
        if (newIndex !== undefined) {
          const newPage = this.$children[newIndex].$el
          removeClass(oldPage, 'active')
          addClass(newPage, 'active')
          this.index = newIndex
        }

        if (prevPage) prevPage.style.display = ''

        if (nextPage) nextPage.style.display = ''
      }

      setTimeout(() => {
        if (towards === 'next') {
          this.translate(currentPage, -pageWidth, speed, callback)
          if (nextPage) {
            this.translate(nextPage, 0, speed)
          }
        } else if (towards === 'prev') {
          this.translate(currentPage, pageWidth, speed, callback)
          if (prevPage) {
            this.translate(prevPage, 0, speed)
          }
        } else {
          this.translate(currentPage, 0, speed, callback)
          if (typeof offsetLeft !== 'undefined') {
            if (prevPage && offsetLeft > 0) this.translate(prevPage, pageWidth * -1, speed)

            if (nextPage && offsetLeft < 0) this.translate(nextPage, pageWidth, speed)
          } else {
            if (prevPage) this.translate(prevPage, pageWidth * -1, speed)

            if (nextPage) this.translate(nextPage, pageWidth, speed)
          }
        }
      }, 10)
    },

    next () {
      this.doAnimate('next')
    },

    prev () {
      this.doAnimate('prev')
    },

    doOnTouchStart (event) {
      if (this.noDrag) return
      if (this.timer) clearInterval(this.timer)

      const element = this.$el
      const dragState = this.dragState
      const touch = event.touches[0]

      dragState.startTime = new Date()
      dragState.startLeft = touch.pageX
      dragState.startTop = touch.pageY
      dragState.startTopAbsolute = touch.clientY

      dragState.pageWidth = element.offsetWidth
      dragState.pageHeight = element.offsetHeight

      let prevPage = this.$children[this.index - 1]
      const dragPage = this.$children[this.index]
      let nextPage = this.$children[this.index + 1]

      if (this.continuous && this.pages.length > 1) {
        if (!prevPage) prevPage = this.$children[this.$children.length - 1]

        if (!nextPage) nextPage = this.$children[0]
      }

      dragState.prevPage = prevPage ? prevPage.$el : null
      dragState.dragPage = dragPage ? dragPage.$el : null
      dragState.nextPage = nextPage ? nextPage.$el : null
    },

    doOnTouchMove (event) {
      if (this.noDrag) return

      const dragState = this.dragState
      const touch = event.touches[0]

      dragState.currentLeft = touch.pageX
      dragState.currentTop = touch.pageY
      dragState.currentTopAbsolute = touch.clientY

      let offsetLeft = dragState.currentLeft - dragState.startLeft
      const offsetTop = dragState.currentTopAbsolute - dragState.startTopAbsolute

      const distanceX = Math.abs(offsetLeft)
      const distanceY = Math.abs(offsetTop)
      if (distanceX < 5 || (distanceX >= 5 && distanceY >= 1.73 * distanceX)) {
        this.userScrolling = true
        return
      } else {
        this.userScrolling = false
        event.preventDefault()
      }
      offsetLeft = Math.min(Math.max(-dragState.pageWidth + 1, offsetLeft), dragState.pageWidth - 1)

      const towards = offsetLeft < 0 ? 'next' : 'prev'

      if (dragState.prevPage) dragState.prevPage.style.display = 'block'

      if (dragState.nextPage) dragState.nextPage.style.display = 'block'

      if (dragState.prevPage && towards === 'prev') this.translate(dragState.prevPage, offsetLeft - dragState.pageWidth)

      this.translate(dragState.dragPage, offsetLeft)

      if (dragState.nextPage && towards === 'next') this.translate(dragState.nextPage, offsetLeft + dragState.pageWidth)
    },

    doOnTouchEnd () {
      if (this.noDrag) return

      this.running()

      const dragState = this.dragState

      const dragDuration = new Date() - dragState.startTime
      let towards = null

      const offsetLeft = dragState.currentLeft - dragState.startLeft
      const offsetTop = dragState.currentTop - dragState.startTop
      const pageWidth = dragState.pageWidth
      const index = this.index
      const pageCount = this.pages.length

      if (dragDuration < 300) {
        let fireTap = Math.abs(offsetLeft) < 5 && Math.abs(offsetTop) < 5
        if (isNaN(offsetLeft) || isNaN(offsetTop)) fireTap = true

        if (fireTap) this.$children[this.index].$emit('tap')
      }

      if (dragDuration < 300 && dragState.currentLeft === undefined) return

      if (dragDuration < 300 || Math.abs(offsetLeft) > pageWidth / 2) towards = offsetLeft < 0 ? 'next' : 'prev'

      if (!this.continuous) {
        if ((index === 0 && towards === 'prev') || (index === pageCount - 1 && towards === 'next')) towards = null
      }

      if (this.$children.length < 2) towards = null

      this.doAnimate(towards, {
        offsetLeft,
        pageWidth: dragState.pageWidth,
        prevPage: dragState.prevPage,
        currentPage: dragState.dragPage,
        nextPage: dragState.nextPage
      })

      this.dragState = {}
    },

    swipeItemCreated () {
      if (!this.ready) return

      clearTimeout(this.reInitTimer)
      this.reInitTimer = setTimeout(() => {
        this.reInitPages()
      }, 100)
    },

    swipeItemDestroyed () {
      if (!this.ready) return

      clearTimeout(this.reInitTimer)
      this.reInitTimer = setTimeout(() => {
        this.reInitPages()
      }, 100)
    }
  },

  mounted () {
    this.ready = true

    this.running()

    this.reInitPages()

    const element = this.$el

    element.addEventListener('touchstart', (event) => {
      if (this.prevent) event.preventDefault()

      if (this.animating) return
      this.dragging = true
      this.userScrolling = false
      this.doOnTouchStart(event)
    })

    element.addEventListener('touchmove', (event) => {
      if (!this.dragging) return
      this.doOnTouchMove(event)
    })

    element.addEventListener('touchend', (event) => {
      if (this.userScrolling) {
        this.dragging = false
        this.dragState = {}
        return
      }
      if (!this.dragging) return
      this.doOnTouchEnd(event)
      this.dragging = false
    })
  },

  destroyed () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    if (this.reInitTimer) {
      clearTimeout(this.reInitTimer)
      this.reInitTimer = null
    }
  }
}
</script>
