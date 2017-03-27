import 'utils/requestAnimationFrame'

export default (step = 20, to = 0) => {
  let top = document.documentElement.scrollTop || document.body.scrollTop
  let AF

  const scroll = () => {
    top -= step

    document.documentElement.scrollTop = document.body.scrollTop = top

    if (top <= to) {
      document.documentElement.scrollTop = document.body.scrollTop = to
      window.cancelAnimationFrame(AF)
    } else {
      AF = window.requestAnimationFrame(scroll)
    }
  }

  scroll()
}
