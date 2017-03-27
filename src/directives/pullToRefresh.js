import throttle from 'utils/throttle'
import 'utils/requestAnimationFrame'
import { getScrollTop, getScrollEventTarget, isAttached } from 'utils/elementAttributeSet'
const ctx = '@@PullToRefresh'

function doBind () {
  if (this.binded) return
  this.binded = true

  const directive = this
  const element = directive.el

  const disabledExpr = element.getAttribute('pull-to-refresh-disabled')
  let disabled = false
  if (disabledExpr) {
    this.vm.$watch(disabledExpr, function (value) {
      directive.disabled = value
    })
    disabled = !!directive.vm[disabledExpr]
  }
  directive.disabled = disabled

  const loadingIndicatorExpr = element.getAttribute('loading-indicator-trigger')
  directive.loadingIndicatorTrigger = this.vm[loadingIndicatorExpr]

  const touches = e => {
    if (!e.touches) e.touches = e.originalEvent.touches
  }

  const touchStart = e => {
    directive.startY = e.touches[0].pageY
    directive.touchScrollTop = getScrollTop(element)
  }

  const touchMove = e => {
    directive.curY = e.touches[0].pageY
    directive.moveY = directive.curY - directive.startY

    if (directive.moveY < 0) return

    if (directive.touchScrollTop <= 0) {
      e.preventDefault()
      dragMoveTrigger.call(directive)
    }
  }

  directive.touchStart = e => {
    throttle(touches(e), 200)
    throttle(touchStart(e), 200)
  }

  directive.touchMove = e => {
    throttle(touches(e), 200)
    throttle(touchMove(e), 200)
  }

  directive.touchEnd = e => {
    if (directive.moveY < 0) return

    if (directive.touchScrollTop <= 0) {
      e.preventDefault()
      dragReleaseTrigger.call(directive)
    }
  }

  const passive = false
  directive.pullEventTarget = getScrollEventTarget(element)
  directive.pullEventTarget.addEventListener('touchstart', directive.touchStart, {passive})
  directive.pullEventTarget.addEventListener('touchmove', directive.touchMove, {passive})
  directive.pullEventTarget.addEventListener('touchend', directive.touchEnd, {passive})
}

function dragMoveTrigger () {
  if (this.disabled) return

  const offset = this.moveY / 2
  if (offset < 0 || offset > this.maxOffset) return

  const refresh = offset >= this.releaseThreshold

  this.loadingIndicatorTrigger(offset, refresh ? 'release' : 'move')
}

function dragReleaseTrigger () {
  if (this.disabled) return

  let offset = this.moveY / 2
  let AF

  const refresh = offset >= this.releaseThreshold

  if (offset > this.maxOffset) offset = this.maxOffset

  const completed = () => {
    if (refresh && this.expression) {
      this.loadingIndicatorTrigger(this.releaseThreshold, 'loading')
      this.expression()
    } else {
      this.loadingIndicatorTrigger(0, 'move')
    }
  }

  const release = () => {
    offset -= 8
    this.loadingIndicatorTrigger(offset, 'release')
    if (offset <= this.releaseThreshold) {
      window.cancelAnimationFrame(AF)
      completed()
    } else {
      AF = window.requestAnimationFrame(release)
    }
  }

  window.requestAnimationFrame(release)
}

export default {
  bind (el, binding, vnode) {
    el[ctx] = {
      el,
      vm: vnode.context,
      expression: binding.value
    }

    const params = vnode.data.attrs
    const { threshold, maxOffset } = params
    el[ctx].releaseThreshold = threshold || 60
    el[ctx].maxOffset = maxOffset || el[ctx].releaseThreshold * 3

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
    el[ctx].pullEventTarget.removeEventListener('touchstart', el[ctx].touchStart)
    el[ctx].pullEventTarget.removeEventListener('touchmove', el[ctx].touchMove)
    el[ctx].pullEventTarget.removeEventListener('touchend', el[ctx].touchEnd)
  }
}
