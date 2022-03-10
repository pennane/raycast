import { Vector } from '../../vector/Vector'
import { v4 as uuidv4 } from 'uuid'

export interface ShapeOptions {
    context: CanvasRenderingContext2D
    x: number
    y: number
}

export abstract class Shape {
    pos: Vector
    context: CanvasRenderingContext2D
    id: string
    constructor({ context, x, y }: ShapeOptions) {
        this.pos = new Vector({ x, y })
        this.context = context
        this.id = uuidv4()
    }
    abstract show(): void
}
