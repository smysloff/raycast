import GC from './GC.mjs'

export default class TileMap {

  constructor(cols, rows, tilesize, map) {
    this.cols = cols
    this.rows = rows
    this.tilesize = tilesize
    this.map = map
    this.size = cols * rows
    this.width = cols * tilesize
    this.height = rows * tilesize
    this.xMin = 0
    this.yMin = 0
    this.xMax = this.width - 1
    this.yMax = this.height - 1
    this.gc = new GC(this.width, this.height)
    for (let col = 0; col < this.cols; ++col) {
      for (let row = 0; row < this.rows; ++row) {
        const index = row * this.cols + col
        const tile = this.map?.[index]
        if (tile === '#') {
          this.gc.context.fillStyle = '#898989'
          this.gc.context.strokeStyle = '#363636'
          this.gc.context.fillRect(
            col * this.tilesize, row * this.tilesize,
              this.tilesize, this.tilesize)
          this.gc.context.strokeRect(
            col * this.tilesize, row * this.tilesize,
              this.tilesize, this.tilesize)
        } else {
          this.gc.context.fillStyle = '#ffffff'
          this.gc.context.fillRect(
            col * this.tilesize, row * this.tilesize,
              this.tilesize, this.tilesize)
        }
      }
    }
  }

  render(gc) {
    gc.context.drawImage(this.gc.element, 0, 0)
  }

}
