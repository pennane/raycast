import { ColoredShape, ColoredShapeOptions } from './ColoredShape'

interface CircleOptions extends ColoredShapeOptions {
    radius: number
}

export class Circle extends ColoredShape {
    radius: number

    constructor(options: CircleOptions) {
        super(options)
        this.radius = options.radius
    }

    show() {
        let oldFillColor = this.context.fillStyle
        this.context.fillStyle = this.color
        this.context.beginPath()
        this.context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
        this.context.fill()
        this.context.closePath()
        this.context.fillStyle = oldFillColor
    }
}
