export default class Timing {
  constructor () {
    this.timing = {}
    this.start()
  }

  start () {
    const { timing } = this
    timing.start = Date.now()
  }

  end () {
    const { timing } = this
    timing.end = Date.now()
    return timing.end - timing.start
  }
}

