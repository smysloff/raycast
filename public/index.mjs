import GC from './GC.mjs'
import FPS from './FPS.mjs'
import Vec2 from './Vec2.mjs'
import TileMap from './TileMap.mjs'

const PI    = Math.PI
const PIx2  = PI * 2
const PI1d2 = PI * .5
const PI3d2 = PI * 1.5

export class Camera {

  constructor(options) {
    this.pos = options.pos
    this.pov = options.pov
    this.turnSpeed = options.turnSpeed
    this.moveSpeed = options.moveSpeed
  }

  render(gc, length) {
    this.renderPOV(gc, length)
    this.renderEntity(gc)
  }

  update(keys, dt) {
    this.updatePOV(keys, dt)
    this.updatePOS(keys, dt)
  }

  updatePOV(keys, dt) {
    if (keys.get('ArrowLeft')) {
      this.pov -= this.turnSpeed * dt
    }
    if (keys.get('ArrowRight')) {
      this.pov += this.turnSpeed * dt
    }
    if (this.pov < 0 || this.pov >= PIx2) {
      this.pov = ((this.pov % PIx2) + PIx2) % PIx2
    }
  }

  updatePOS(keys, dt) {
    const move = new Vec2(0, 0)
    if (keys.get('ArrowDown') || keys.get('KeyS')) {
      move.x -= 1
    }
    if (keys.get('ArrowUp') || keys.get('KeyW')) {
      move.x += 1
    }
    if (keys.get('KeyA')) {
      move.y -= 1
    }
    if (keys.get('KeyD')) {
      move.y += 1
    }
  }

  renderPOV(gc, length) {
    const pov = {
      x: this.pos.x + Math.cos(this.pov) * length,
      y: this.pos.y + Math.sin(this.pov) * length
    }
    gc.context.strokeStyle = '#ffb300'
    gc.context.beginPath()
    gc.context.moveTo(this.pos.x, this.pos.y)
    gc.context.lineTo(pov.x, pov.y)
    gc.context.stroke()
  }

  renderEntity(gc) {
    gc.context.fillStyle = 'Red'
    gc.context.beginPath()
    gc.context.arc(this.pos.x, this.pos.y, 4, 0, PIx2)
    gc.context.fill()
  }

}

export class App {

  constructor(width, height) {
    this.fps = new FPS()
    this.map = new GC(width, height)
    this.view = new GC(width, height)
    this.keys = new Map()
    this.dt = 0
    this.element = document.createElement('div')
    this.element.append(this.view.element, this.map.element)
  }

  createCamera(options) {
    this.camera = new Camera(options)
  }

  createWorld(cols, rows, tilesize, map) {
    this.world = new TileMap(cols, rows, tilesize, map)
  }

  loop(timestamp = 0) {
    requestAnimationFrame(timestamp => this.loop(timestamp))
    app.update(timestamp)
    app.render()
  }

  update(timestamp) {
    this.dt = app.fps.update(timestamp)
    this.camera.updatePOV(this.keys, this.dt)
  }

  render() {
    this.view.clearAll()
    this.map.clearAll()
    this.fps.render(this.view)
    this.world.render(this.map)
    this.camera.render(this.map, this.world.tilesize)
  }

  mount(parent) {
    parent.append(this.element)
  }

}

const GRID_COLS = 16
const GRID_ROWS = 8
const CELL_SIZE = 31

const GRID_MAP1 =   ''
  + '################'
  + '# #    #  #    #'
  + '#    # ## # ## #'
  + '#    # #       #'
  + '#      #    # ##'
  + '#   #####  ##  #'
  + '##         #   #'
  + '################'

const GRID_MAP2 =   ''
  + '                '
  + '  #    #  #     '
  + '     # ## # ##  '
  + '     # #        '
  + '       #    # # '
  + '    #####  ##   '
  + ' #         #    '
  + '                '

const CAMERA_X = CELL_SIZE * 3.5
const CAMERA_Y = CELL_SIZE * 3.5
const CAMERA_POV = 0

const app = new App(
  GRID_COLS * CELL_SIZE,
  GRID_ROWS * CELL_SIZE
)

app.createCamera({
  pos: new Vec2(CAMERA_X, CAMERA_Y),
  pov: CAMERA_POV,
  turnSpeed: PI,
  moveSpeed: 120,
})

app.createWorld(GRID_COLS, GRID_ROWS, CELL_SIZE, GRID_MAP1)

app.mount(document.body)
app.loop()

addEventListener('keydown', (e) => app.keys.set(e.code, true))
addEventListener('keyup',   (e) => app.keys.set(e.code, false))
