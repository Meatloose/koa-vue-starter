import throttle from 'utils/throttle'
import 'utils/requestAnimationFrame'
import { isAttached } from 'utils/elementAttributeSet'
const ctx = '@@ImgLazyLoad'

function doBind () {
  if (this.binded) return
  this.binded = true

  const directive = this

  // custom scrollEnd event
  if (directive.speed) {
    let cntr = 0
    let lastCntr = 0
    let diff = 0
    const scrollEnd = document.createEvent('HTMLEvents')
    scrollEnd.initEvent('scrollEnd', true, false)
    scrollEnd.eventType = 'message'

    const enterFrame = () => {
      if (cntr !== lastCntr) {
        diff++
        if (diff === 5) {
          window.dispatchEvent(scrollEnd)
          cntr = lastCntr
        }
      }
      directive.AF = window.requestAnimationFrame(enterFrame)
    }
    enterFrame()

    directive.resetCount = throttle(() => {
      lastCntr = cntr
      diff = 0
      cntr++
    }, 350)

    document.addEventListener('scroll', directive.resetCount, true)
  }

  // compute scroll speed
  let lastPosY = document.body ? document.body.getBoundingClientRect().top : document.head.parentNode.getBoundingClientRect().top
  let lastPosX = document.body ? document.body.getBoundingClientRect().left : document.head.parentNode.getBoundingClientRect().left
  directive.lastSpeeds = []
  directive.aveSpeed = 0

  function getSpeed (ele) {
    const curPosY = ele ? ele.getBoundingClientRect().top : 0
    const curPosX = ele ? ele.getBoundingClientRect().left : 0
    const speedY = lastPosY - curPosY
    const speedX = lastPosX - curPosX
    if (directive.lastSpeeds.length < 10) {
      directive.lastSpeeds.push((speedY + speedX) / 2)
    } else {
      directive.lastSpeeds.shift()
      directive.lastSpeeds.push((speedY + speedX) / 2)
    }
    let sumSpeed = 0
    directive.lastSpeeds.forEach(speed => {
      sumSpeed += speed
    })
    directive.aveSpeed = Math.abs(sumSpeed / directive.lastSpeeds.length)
    lastPosY = curPosY
    lastPosX = curPosX
  }

  directive.scroll = throttle(function (e) {
    if (!directive.speed) return

    let target = null
    for (let i = 0; i < e.target.childNodes.length; i++) {
      if (e.target.childNodes[i].nodeType === 1) {
        target = e.target.childNodes[i]
        break
      }
    }
    getSpeed(target)
  }, 350)

  document.addEventListener('scroll', directive.scroll, true)
}

function inserted (el) {
  const directive = el[ctx]

  if (directive.fadein) {
    el.style.opacity = 0
    el.style.transition = 'opacity .1s'
    el.style.webkitTransition = 'opacity .1s'
  }

  const compute = throttle(() => {
    if (el === null) return

    const rect = el.getBoundingClientRect()
    const vpWidth = document.head.parentNode.clientWidth
    const vpHeight = document.head.parentNode.clientHeight

    const loadImg = () => {
      if (typeof directive.expression === 'function') directive.expression()
      else el.src = directive.expression

      el.addEventListener('load', onloadEnd)
      window.removeEventListener('scrollEnd', compute, true)
      window.removeEventListener('resize', compute, true)
      window.removeEventListener('scroll', computeBySpeed, true)
      directive.lastSpeeds = []
    }

    if (directive.updated) return

    if (directive.horizontal && rect.bottom >= 0 && rect.top <= vpHeight) loadImg()
    else if (rect.bottom >= 0 && rect.top <= vpHeight && rect.right >= 0 && rect.left <= vpWidth) loadImg()
  }, 350)

  const computeBySpeed = throttle(() => {
    if (directive.speed && directive.aveSpeed > directive.speed) return
    compute()
  }, 350)

  const onload = () => {
    compute()
    el && el.removeEventListener('load', onload)
    window.addEventListener('scrollEnd', compute, true)
    window.addEventListener('resize', compute, true)
    window.addEventListener('scroll', computeBySpeed, true)
  }

  const onloadEnd = () => {
    if (el === null) return
    if (directive.fadein) el.style.opacity = 1
    directive.updated = true
    el.removeEventListener('load', onloadEnd)
  }

  el.addEventListener('load', onload)
}

export default {
  bind (el, binding, vnode) {
    el[ctx] = {
      el,
      vm: vnode.context,
      expression: binding.value
    }

    const params = vnode.data.attrs
    el[ctx].fadein = params.fadein || true
    el[ctx].speed = params.speed || 20
    el[ctx].horizontal = params.horizontal || false

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

  inserted,

  unbind (el) {
    window.cancelAnimationFrame(el[ctx].AF)
    document.removeEventListener('scroll', el[ctx].resetCount, true)
    document.removeEventListener('scroll', el[ctx].scroll, true)
  }
}
