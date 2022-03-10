import './style/global.css'
import { Ray } from './canvas/ray/Ray'
import ResponsiveCanvas from './canvas/ResponsiveCanvas'
import { Circle } from './canvas/shape/Circle'
import { degToRad, randomInteger } from './util'
import { Vector } from './vector/Vector'

const responsiveCanvas = new ResponsiveCanvas({
    target: document.getElementById('canvas') as HTMLCanvasElement,
    options: {
        mouseMove: true,
        resizing: true
    }
})
const canvas = responsiveCanvas.canvas
const context = responsiveCanvas.ctx

let circleMinSize = 5
let circleMaxSize = 110
let circlesFactor = 29
let circlesOn = false

let rayLineWidth = 1
let rayAmount = 300
let maxMarchIterations = 30
let maxRayReflections = 0
let rayOptions = {
    showCircles: false,
    showRays: false,
    showPoints: true,
    color: '#fdf3c6'
}

const circlesAmount = Math.round(Math.sqrt(canvas.width * canvas.height) / circlesFactor)
const circles: Circle[] = []
for (let i = 0; i < circlesAmount; i++) {
    let x = randomInteger(0, canvas.width)
    let y = randomInteger(0, canvas.height)
    let r = randomInteger(circleMinSize, circleMaxSize)
    circles.push(new Circle({ context, x, y, radius: r }))
}

let angles: number[] = []
for (let i = 1; i <= rayAmount; i++) {
    angles.push(degToRad((360 / rayAmount) * i))
}

function drawCircles() {
    context.lineWidth = 1
    for (const circle of circles) {
        circle.show()
    }
}

function drawBg() {
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
}

function drawRays({ x, y }: { x: number; y: number }) {
    context.lineWidth = rayLineWidth
    for (const angle of angles) {
        const ray = new Ray({
            ...rayOptions,
            context,
            x,
            y,
            angle
        })
        ray.march({ items: circles, maxIterationCount: maxRayReflections, maxMarchCount: maxMarchIterations })
    }
}

function animate({ x, y }: Vector) {
    drawBg()
    if (circlesOn) {
        drawCircles()
    }
    drawRays({ x, y })
}

let scheduled: MouseEvent | null = null
canvas.addEventListener('mousemove', (event) => {
    if (!scheduled) {
        setTimeout(() => {
            responsiveCanvas.setCoordinates(event)
            animate(responsiveCanvas.coordinates)
            scheduled = null
        }, 1000 / 60)
    }
    scheduled = event
})

drawBg()
drawCircles()
