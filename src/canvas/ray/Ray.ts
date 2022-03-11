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
    items: Circle[]
    maxIterationCount: number
    maxMarchCount: number
    startingPosition?: Vector
    direction?: Vector
    iteration?: number
    previousClosest?: Circle
    color?: string
}
export class Ray {
    context: CanvasRenderingContext2D
    pos: Vector
    angle: number
    showLines: boolean
    showPoints: boolean
    color: string

    constructor({ context, x, y, angle, ...options }: RayOptions) {
        this.pos = new Vector({ x, y })
        this.angle = angle
        this.context = context
        this.showLines = !!options.showRays
        this.showPoints = !!options.showPoints
        this.color = options.color
    }

    march({
        startingPosition = this.pos,
        items,
        direction = new DirVector({ angle: this.angle }),
        iteration = 0,
        color = this.color,
        ...options
    }: MarchOptions) {
        let significantItems: Circle[]
        if (options.previousClosest) {
            significantItems = items.filter((i) => i.id !== options.previousClosest!.id)
        } else {
            significantItems = items
        }

        let currentPosition = startingPosition

        let closest = this.closest(significantItems, currentPosition)
        let distance = currentPosition.signedDistance(closest)

        let i = 0
        while (i < options.maxMarchCount) {
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

        const tranmissionAmount = Math.max(Math.min(closest.colorTransmission, 1), 0)

        const newColor = average([color || this.color, closest.color], undefined, [
            1 - tranmissionAmount,
            tranmissionAmount
        ])
            .alpha(0.9 - iteration * (0.9 / options.maxIterationCount))
            .hex()

        if (this.showPoints) {
            this.context.fillStyle = newColor
            const size = 3
            this.context.fillRect(currentPosition.x - size / 2, currentPosition.y - size / 2, size, size)
        }

        if (iteration < options.maxIterationCount) {
            const normal = currentPosition.minus(closest.pos).normalize()
            const velocity = startingPosition.minus(currentPosition).normalize()
            const perpendicular = normal.mult(velocity.dotProduct(normal))
            const parallel = velocity.minus(perpendicular)
            const direction = parallel.minus(perpendicular).mult(-1)

            this.march({
                items,
                direction,
                maxIterationCount: options.maxIterationCount,
                maxMarchCount: options.maxMarchCount,
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
