import throttle from 'utils/throttle'
import { getScrollTop, getScrollEventTarget, getVisibleHeight, getElementTop, isAttached } from 'utils/elementAttributeSet'
const ctx = '@@InfiniteScroll'

function doBind () {
  if (this.binded) return
  this.binded = true

  const directive = this
  const element = directive.el

  directive.scrollEventTarget = getScrollEventTarget(element)
  directive.scrollListener = throttle(doTrigger.bind(directive), 200)
  directive.scrollEventTarget.addEventListener('scroll', directive.scrollListener)

  const disabledExpr = element.getAttribute('infinite-scroll-disabled')
  let disabled = false
  if (disabledExpr) {
    this.vm.$watch(disabledExpr, function (value) {
      directive.disabled = value
      if (!value && directive.immediateCheck) doTrigger.call(directive)
    })
    disabled = !!directive.vm[disabledExpr]
  }
  directive.disabled = disabled

  const distanceExpr = element.getAttribute('infinite-scroll-distance')
  let distance = 0
  if (distanceExpr) {
    distance = +(directive.vm[distanceExpr] || distanceExpr)
    if (isNaN(distance)) distance = 0
  }
  directive.distance = distance

  const immediateCheckExpr = element.getAttribute('infinite-scroll-immediate-check')
  let immediateCheck = false
  if (immediateCheckExpr) immediateCheck = !!directive.vm[immediateCheckExpr]

  directive.immediateCheck = immediateCheck

  if (immediateCheck) doTrigger.call(directive)

  const eventName = element.getAttribute('infinite-scroll-listen-for-event')
  if (eventName) directive.vm.$on(eventName, () => { doTrigger.call(directive) })
}

function doTrigger () {
  const scrollEventTarget = this.scrollEventTarget
  const element = this.el
  const distance = this.distance

  if (this.disabled) return

  const viewportScrollTop = getScrollTop(scrollEventTarget)
  const viewportBottom = viewportScrollTop + getVisibleHeight(scrollEventTarget)

  let shouldTrigger = false

  if (scrollEventTarget === element) {
    shouldTrigger = scrollEventTarget.scrollHeight - viewportBottom <= distance
  } else {
    const elementBottom = parseInt(getElementTop(element) - getElementTop(scrollEventTarget) + element.offsetHeight + viewportScrollTop, 10)

    shouldTrigger = viewportBottom + distance >= elementBottom
  }

  const loadingIndicatorExpr = element.getAttribute('loading-indicator-trigger')
  if (shouldTrigger && this.expression) {
    if (loadingIndicatorExpr) this.vm[loadingIndicatorExpr]()
    this.expression()
  }
}

export default {
  bind (el, binding, vnode) {
    el[ctx] = {
      el,
      vm: vnode.context,
      expression: binding.value
    }

    const args = arguments
    el[ctx].vm.$on('hook:mounted', function () {
      el[ctx].vm.$nextTick(function () {
        if (isAttached(el)) {
          doBind.call(el[ctx], args)
        }

        el[ctx].bindTryCount = 0

        var tryBind = function () {
          if (el[ctx].bindTryCount > 10) return
          el[ctx].bindTryCount++
          if (isAttached(el)) {
            doBind.call(el[ctx], args)
          } else {
            setTimeout(tryBind, 50)
          }
        }

        tryBind()
      })
    })
  },

  unbind (el) {
    el[ctx].scrollEventTarget.removeEventListener('scroll', el[ctx].scrollListener)
  }
}
