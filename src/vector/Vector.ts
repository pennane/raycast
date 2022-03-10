import { Circle } from '../canvas/shape/Circle'

export interface VectorOptions {
    x: number
    y: number
}

export class Vector {
    x: number
    y: number
    constructor({ x, y }: VectorOptions) {
        this.x = x
        this.y = y
    }
    plus(vector: Vector) {
        return new Vector({ x: this.x + vector.x, y: this.y + vector.y })
    }
    minus(vector: Vector) {
        return new Vector({ x: this.x - vector.x, y: this.y - vector.y })
    }
    mult(num: number) {
        return new Vector({ x: this.x * num, y: this.y * num })
    }
    distance(vector: Vector) {
        return Math.hypot(vector.x - this.x, vector.y - this.y)
    }
    signedDistance(circle: Circle) {
        let distance = this.distance(circle.pos)
        return distance - circle.radius
    }
    normalize() {
        const length = this.length
        return new Vector({ x: this.x / length, y: this.y / length })
    }
    dotProduct(vector: Vector) {
        if (this.x === 0 && this.y === 0) return 0
        if (vector.x === 0 && vector.y === 0) return 0

        return this.x * vector.x + this.y * vector.y
    }

    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
}
