import { Shape, ShapeOptions } from './Shape'

export interface ColoredShapeOptions extends ShapeOptions {
    color: string | 'random'
    colorTransmission: number
}

export abstract class ColoredShape extends Shape {
    color: string
    colorTransmission: number
    constructor(options: ColoredShapeOptions) {
        super(options)
        if (options.color === 'random') {
            this.color = ColoredShape.getRandomColor()
        } else {
            this.color = options.color
        }
        this.colorTransmission = options.colorTransmission
    }

    static basicColors = ['green', 'red', 'yellow', 'blue', 'orange', 'purple']

    static getRandomColor() {
        return ColoredShape.basicColors[Math.floor(Math.random() * ColoredShape.basicColors.length)]
    }
}
