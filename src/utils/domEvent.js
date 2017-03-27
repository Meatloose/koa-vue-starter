export const On = ((() => {
  if (document.addEventListener) {
    return (element, event, handler) => {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return (element, event, handler) => {
      if (element && event && handler) {
        element.attachEvent(`on${event}`, handler)
      }
    }
  }
}))()

export const Off = ((() => {
  if (document.removeEventListener) {
    return (element, event, handler) => {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return (element, event, handler) => {
      if (element && event) {
        element.detachEvent(`on${event}`, handler)
      }
    }
  }
}))()

export const Once = (el, event, fn) => {
  const listener = function () {
    if (fn) {
      fn.apply(this, arguments)
    }
    Off(el, event, listener)
  }
  On(el, event, listener)
}
