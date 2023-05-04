
class Logger {
  name = ['Logger']

  constructor(name = '') {
    this.name.push(name) //  = name
  }

  info(...args) {
    console.info(this.name.join(' '), ':', ...args)
  }
}

export class Canvas2D {
  dom = null
  ctx = null

  log = new Logger('Canvas2D')

  constructor({
    dom = document.createElement('canvas'),
  } = {}) {
    this.dom = dom
    //
    this.getContext()
  }

  getContext() {
    return this.ctx = this.dom.getContext('2d')
  }

  setSize(w = 100, h = 100) {
    this.log.info('setSize', { w, h })

    this.dom.width = w
    this.dom.style.width = w

    this.dom.height = h
    this.dom.style.height = h

    return this
  }
}

export class Context2D {
  canvas = null
  log = new Logger('Context2D')

  events = {
    'setup': [],
    'draw': [],
    'resize': [],
    'interval': [],
  }

  geometries = []

  constructor({
    canvas = new Canvas2D(),
  } = {}) {
    this.canvas = canvas

    window.requestAnimationFrame(this.render.bind(this))

    this.on('draw', () => {
      const ctx = this.canvas.getContext()
      const time = Date.now()

      this.geometries.map((geo) => geo.draw({ ctx, time, }))
    })

    this.render()
  }

  dispatch(name) {
    // this.log.info('dispatch', { name })

    const ctx = this
    const time = Date.now()
    this.events[name].map(({ event: fn, params }) => fn({ ctx, time, }))
  }

  on(name, event, params = {}) {
    const self = this

    self.log.info('on', { name, event, params })

    if (self.events[name])
      self.events[name].push({ event, params })


    if (['setup', 'draw', 'resize'].indexOf(name) !== -1) {
      self.dispatch(name)
    } else if (['interval'].indexOf(name) !== -1) {
      window.setInterval(() => {
        self.dispatch(name)
      }, params['time'] || 1e4)
    } else {
    }
  }

  render() {
    this.dispatch('draw')

    window.requestAnimationFrame(this.render.bind(this))
  }

  add(geometry = new Geometry()) {
    this.log.info('add', { geometry })

    this.geometries.push(geometry)
  }
}

export class Color {
  log = new Logger('Color')

  type = 'rgba'
  numbers = [0, 0, 0, 0,]

  setRGBA(r, g, b, a = 1) {
    this.type = 'rgba'
    this.numbers = [r, g, b, a]

    return this
  }

  setRGB(r, g, b) {
    return this.setRGBA(r, g, b, 1)
  }

  getRGBA() {
    const [r, g, b, a,] = this.numbers
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  toString() {
    switch (this.type) {
      case 'rgba': return this.getRGBA()
    }
  }

}

export class XY {
  log = new Logger('XY')

  x = 0
  y = 0

  set(x = this.x, y = this.y) {
    this.log.info('set', { x, y })

    this.x = x
    this.y = y

    return this
  }
}

export class Position extends XY {
  constructor() {
    super()
    this.log.name.push('Position')
  }
}

export class Rotation extends XY {
  constructor() {
    super()
    this.log.name.push('Rotation')
  }
}

export class Geometry {
  log = new Logger('Geometry')

  width = 10
  height = 10

  setSize(w, h) {
    this.width = w
    this.height = h
  }

  position = new Position(0, 0)
  rotation = new Rotation(0, 0)
  color = new Color(0xFFFFFF)
}

export class Rect extends Geometry {
  draw({ ctx }) {
    ctx.fillStyle = this.color.toString()
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height,
    )

    // ctx.setTransform(1, 0, 0, 1, 0, 0)
  }
}
