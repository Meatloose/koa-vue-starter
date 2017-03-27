const throttle = function (fn, delay) {
  let exec, timer, context
  let last = 0

  return function (...args) {
    context = this

    let delta = new Date() - last

    const execute = () => {
      timer = 0
      last = +new Date()
      exec = fn.apply(context, args)
      context = null
      args = null
    }

    if (!timer) {
      if (delta >= delay) execute()
      else timer = setTimeout(execute, delay - delta)
    }
    return exec
  }
}

export default throttle
