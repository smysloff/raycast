export default class FPS {

  constructor() {
    this.values = []
    this.count = 0
    this.lastSecond = 0
    this.deltaSecond = 0
    this.lastTime = 0
    this.deltaTime = 0
  }

  update(timestamp) {
    this.deltaSecond = timestamp - this.lastSecond
    if (this.deltaSecond < 1000) {
      ++this.count
    } else {
      this.addValue(this.count)
      this.count = 0
      this.lastSecond = timestamp
    }
    this.deltaTime = timestamp - this.lastTime
    this.lastTime = timestamp
    return this.deltaTime * .001
  }

  render(gc) {
    gc.context.fillStyle = 'Lime'
    gc.context.font = '20px monospace'
    gc.context.textAlign = 'right'
    gc.context.textBaseline = 'top'
    gc.context.fillText(this.value, gc.element.width - 4, 6)
  }

  addValue(value) {
    this.values.unshift(value)
    while (this.values.length > 60) {
      this.values.pop()
    }
  }

  get value() {
    return this.values[0] ?? 0
  }

}
