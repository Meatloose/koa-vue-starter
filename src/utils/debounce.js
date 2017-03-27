const debounce = function (fn, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    timer = setTimeout(() => {
      timer = null
      fn.apply(this, args)
    }, delay)
  }
}

export default debounce
