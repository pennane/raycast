import { Vector } from '../vector/Vector'

interface ResponsiveCanvasOptions {
    width?: number
    height?: number
    resizing?: boolean
    fromOffset?: boolean
    mouseMove?: boolean
}

export default class ResponsiveCanvas {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    coordinates: Vector

    scheduled: boolean
    constructor({ target, options }: { target: HTMLCanvasElement; options?: ResponsiveCanvasOptions }) {
        this.canvas = target
        this.coordinates = new Vector({ x: 0, y: 0 })
        this.ctx = target.getContext('2d')!
        this.scheduled = false

        if (options?.fromOffset) {
            this.canvas.width = target.offsetWidth
            this.canvas.height = target.offsetHeight
        } else {
            this.canvas.width = options?.width || target.width
            this.canvas.height = options?.height || target.height
        }

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
}
