import { Vector } from '../vector/Vector'

interface ResponsiveCanvasOptions {
    resizing?: boolean
    mouseMove?: boolean
}

export default class ResponsiveCanvas {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    coordinates: Vector

    scheduled?: boolean
    constructor({ target, options }: { target: HTMLCanvasElement; options?: ResponsiveCanvasOptions }) {
        if (!target || !ResponsiveCanvas.isCanvas(target)) {
            throw new Error('Missing canvas element')
        }
        this.canvas = target
        this.ctx = target.getContext('2d')!

        this.canvas.width = target.offsetWidth
        this.canvas.height = target.offsetHeight

        this.coordinates = new Vector({ x: 0, y: 0 })

        if (options?.mouseMove) {
            this.canvas.addEventListener('mousemove', (event) => {
                this.setCoordinates(event)
            })
        }
        if (options?.resizing) {
            this.scheduled = false
            window.addEventListener('resize', () => {
                if (!this.scheduled) {
                    setTimeout(() => {
                        this.resize()
                        this.scheduled = false
                    }, 500)
                }
                this.scheduled = true
            })
        }
    }
    getMousePos(event: MouseEvent): Vector {
        const rect = this.canvas.getBoundingClientRect()

        const scaleX = this.canvas.width / rect.width
        const scaleY = this.canvas.height / rect.height

        const coordinates = new Vector({
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY
        })

        return coordinates
    }
    setCoordinates(event: MouseEvent) {
        this.coordinates = this.getMousePos(event)
    }
    resize() {
        this.canvas.width = this.canvas.offsetWidth
        this.canvas.height = this.canvas.offsetHeight
    }

    static isCanvas(el: any): el is HTMLCanvasElement {
        return el instanceof HTMLCanvasElement
    }
}
