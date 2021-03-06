let lastTime = 0
const vendors = ['webkit', 'moz']

for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
  window.requestAnimationFrame = window[`${vendors[x]}RequestAnimationFrame`]
  window.cancelAnimationFrame = window[`${vendors[x]}CancelAnimationFrame`] || window[`${vendors[x]}CancelRequestAnimationFrame`] // Webkit中此取消方法的名字变了
}

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback, element) => {
    const currTime = new Date().getTime()
    const timeToCall = Math.max(0, 16.7 - (currTime - lastTime))
    const id = window.setTimeout(() => {
      callback(currTime + timeToCall)
    }, timeToCall)
    lastTime = currTime + timeToCall
    return id
  }
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = id => {
    clearTimeout(id)
  }
}
