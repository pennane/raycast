import { Circle } from '../shape/Circle'
import { DirVector } from '../../vector/DirVector'
import { Vector, VectorOptions } from '../../vector/Vector'
import { average } from 'chroma-js'

interface RayOptions extends VectorOptions {
    context: CanvasRenderingContext2D
    angle: number
    showCircles?: boolean
    showRays?: boolean
    showPoints?: boolean
    color: string
}

interface MarchOptions {
    startingPosition?: Vector
    items: Circle[]
    direction?: Vector
    iteration?: number
    previousClosest?: Circle
    color?: string
    maxIterationCount: number
}

export class Ray {
    context: CanvasRenderingContext2D
    pos: Vector
    angle: number
    showCircles: boolean
    showLines: boolean
    showPoints: boolean
    color: string

    constructor({ context, x, y, angle, ...options }: RayOptions) {
        this.pos = new Vector({ x, y })
        this.angle = angle
        this.context = context
        this.showCircles = !!options.showCircles
        this.showLines = !!options.showRays
        this.showPoints = !!options.showPoints
        this.color = options.color
    }

    march({
        startingPosition = this.pos,
        items,
        direction = new DirVector({ angle: this.angle }),
        iteration = 0,
        previousClosest,
        color = this.color,
        maxIterationCount
    }: MarchOptions) {
        const oldStrokeStyle = this.context.strokeStyle
        const oldFillStyle = this.context.fillStyle

        const significantItems = previousClosest ? items.filter((i) => i.id !== previousClosest.id) : items

        let currentPosition = startingPosition

        let closest = this.closest(significantItems, currentPosition)
        let distance = currentPosition.signedDistance(closest)

        let i = 0
        while (i < 50) {
            if (distance < 1 || distance > window.innerWidth / 3) break

            if (this.showLines) {
                this.context.strokeStyle = color
                this.context.beginPath()
                this.context.moveTo(currentPosition.x, currentPosition.y)
                const to = currentPosition.plus(direction.mult(distance))
                this.context.lineTo(to.x, to.y)
                this.context.stroke()
                this.context.closePath()
            }

            currentPosition = currentPosition.plus(direction.mult(distance))
            closest = this.closest(significantItems, currentPosition)

            distance = currentPosition.signedDistance(closest)

            i++
        }

        const newColor = average([color || this.color, closest.color], undefined, [0.1, 0.9])
            .alpha(0.8 - iteration * (0.8 / maxIterationCount))
            .hex()

        if (this.showPoints) {
            this.context.fillStyle = newColor
            const size = 3
            this.context.fillRect(currentPosition.x - size / 2, currentPosition.y - size / 2, size, size)
        }

        this.context.strokeStyle = oldStrokeStyle
        this.context.fillStyle = oldFillStyle

        if (iteration < maxIterationCount) {
            const normal = currentPosition.minus(closest.pos).normalize()
            const velocity = startingPosition.minus(currentPosition).normalize()
            const perpendicular = normal.mult(velocity.dotProduct(normal))
            const parallel = velocity.minus(perpendicular)
            const direction = parallel.minus(perpendicular).mult(-1)

            this.march({
                items,
                direction,
                maxIterationCount,
                startingPosition: currentPosition,
                iteration: iteration + 1,
                previousClosest: closest,
                color: newColor
            })
        }
    }

    closest(items: Circle[], point: Vector) {
        return items.reduce((a, b) => (point.signedDistance(a) < point.signedDistance(b) ? a : b))
    }
}
