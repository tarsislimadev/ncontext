document.body.style.margin = '0'

import { Canvas2D, Context2D, Rect } from './context.js'

const width = window.innerWidth
const height = window.innerHeight

const canvas = new Canvas2D()
canvas.setSize(width, height)
document.body.append(canvas.dom)

const context = new Context2D({ canvas })

//

const background = new Rect()
background.setSize(width, height)
background.color.setRGB(+0.0, +0.0, +0.0)

context.on('setup', ({ ctx }) => {
  ctx.add(background)
})

context.on('draw', ({ ctx, time }) => {
})
