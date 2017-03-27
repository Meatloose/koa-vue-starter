const resize = () => {
  const maxWidth = 640
  let timer
  window.onresize = () => {
    if (timer) clearTimeout(timer)

    timer = setTimeout(resize, 100)
  }

  const clientWidth = document.body.clientWidth || document.documentElement.clientWidth

  if (clientWidth <= maxWidth) {
    document.querySelector('html').style['font-size'] = `${clientWidth / 320 * 100}%`
    timer = null
  }
}

export default resize()
