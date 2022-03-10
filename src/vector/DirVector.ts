import { Vector } from './Vector'

export interface DirVectorOptions {
    angle: number
}

export class DirVector extends Vector {
    constructor({ angle }: DirVectorOptions) {
        super({ x: Math.cos(angle), y: Math.sin(angle) })
    }
}
