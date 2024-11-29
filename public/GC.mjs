export default class GC {

  constructor(width, height) {
    this.element = document.createElement('canvas')
    this.context = this.element.getContext('2d')
    if (width) this.element.width = width
    if (height) this.element.height = height
  }

  clearAll() {
    this.context.clearRect(0, 0,
      this.element.width, this.element.height)
  }

}
