import { Ray } from './canvas/ray/Ray'
import ResponsiveCanvas from './canvas/ResponsiveCanvas'
import { Circle } from './canvas/shape/Circle'
import './style/global.css'
import { Vector } from './vector/Vector'

function randomInteger(min: number, max: number) {
    return Math.random() * (max - min) + min
}

function isCanvas(e: any): e is HTMLCanvasElement {
    return e instanceof HTMLCanvasElement
}

function degToRad(degrees: number): number {
    return degrees * (Math.PI / 180)
}

const canvasTarget = document.getElementById('canvas')

if (!canvasTarget || !isCanvas(canvasTarget)) {
    throw new Error('Missing canvas element')
}

const responsiveCanvas = new ResponsiveCanvas({
    target: canvasTarget,
    options: {
        fromOffset: true,
        mouseMove: true,
        resizing: true
    }
})
const canvas = responsiveCanvas.canvas
const context = responsiveCanvas.ctx

const circlesAmount = 20
const circles: Circle[] = []

for (let i = 0; i < circlesAmount; i++) {
    let x = randomInteger(0, canvas.width)
    let y = randomInteger(0, canvas.height)
    let r = randomInteger(20, 80)
    const circle = new Circle({ context, x, y, radius: r })
    circles.push(circle)
}

const rayAmount = 4

function drawBg() {
    context.fillRect(0, 0, canvas.width, canvas.height)
}

function drawCircles() {
    context.lineWidth = 1
    for (const circle of circles) {
        circle.show()
    }
}

function drawRays({ x, y }: { x: number; y: number }) {
    context.lineWidth = 2
    for (let i = 1; i <= rayAmount; i++) {
        const angle = degToRad((360 / rayAmount) * i)

        const ray = new Ray({
            context,
            x,
            y,
            angle,
            showCircles: false,
            showRays: true,
            showPoints: true,
            color: 'white'
        })
        ray.march({ items: circles, maxIterationCount: 3 })
    }
}

function animate({ x, y }: Vector) {
    drawBg()
    drawCircles()
    drawRays({ x, y })
}

let scheduled: MouseEvent | null = null
canvas.addEventListener('mousemove', (event) => {
    if (!scheduled) {
        setTimeout(() => {
            responsiveCanvas.setCoordinates(event)
            animate(responsiveCanvas.coordinates)
            scheduled = null
        }, 17)
    }
    scheduled = event
})

drawBg()
drawCircles()
