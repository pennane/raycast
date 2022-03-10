import { Shape, ShapeOptions } from './Shape'

export interface ColoredShapeOptions extends ShapeOptions {
    color?: string
}

export abstract class ColoredShape extends Shape {
    color: string
    constructor(options: ColoredShapeOptions) {
        super(options)
        this.color = options.color || ColoredShape.getRandomColor()
    }

    static basicColors = ['green', 'red', 'yellow', 'blue', 'orange', 'purple']

    static getRandomColor() {
        return ColoredShape.basicColors[Math.floor(Math.random() * ColoredShape.basicColors.length)]
    }
}
