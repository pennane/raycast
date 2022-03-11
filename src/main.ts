import './style/global.css'
import { Ray } from './canvas/ray/Ray'
import ResponsiveCanvas from './canvas/ResponsiveCanvas'
import { Circle } from './canvas/shape/Circle'
import { degToRad, mulberry32, seededRandomArbitrary } from './util'
import { Vector } from './vector/Vector'
import { loadDefaultSettingsToDom, loadSettingsFromDom, SettingsParams } from './settings'

let seed = Math.round(Math.random() * 10000000)
const seedElement = document.getElementById('seed')! as HTMLInputElement
seedElement.value = String(seed)
document.getElementById('seed')!.addEventListener('change', () => (seed = parseFloat(seedElement.value)))

const mainTarget = document.getElementById('canvas-target')!

function start(settings: SettingsParams) {
    const randomGenerator = mulberry32(seed)
    while (mainTarget?.firstChild) {
        mainTarget.removeChild(mainTarget.firstChild)
    }

    const c = document.createElement('canvas')
    c.id = 'canvas'
    mainTarget.appendChild(c)
    const responsiveCanvas = new ResponsiveCanvas({
        target: c as HTMLCanvasElement,
        options: {
            mouseMove: true,
            resizing: true
        }
    })

    const canvas = responsiveCanvas.canvas
    const context = responsiveCanvas.ctx

    const circlesAmount = Math.round(Math.sqrt(canvas.width * canvas.height) / settings.circles.amountFactor)

    const circles: Circle[] = []

    for (let i = 0; i < circlesAmount; i++) {
        let x = seededRandomArbitrary(randomGenerator, 0, canvas.width)
        let y = seededRandomArbitrary(randomGenerator, 0, canvas.height)
        let r = seededRandomArbitrary(randomGenerator, settings.circles.minSize, settings.circles.maxSize)

        circles.push(
            new Circle({
                context,
                x,
                y,
                radius: r,
                color: settings.shapes.shapeColor,
                colorTransmission: settings.shapes.shapeColorTransmission
            })
        )
    }

    let angles: number[] = []
    for (let i = 1; i <= settings.rays.amount; i++) {
        angles.push(degToRad((360 / settings.rays.amount) * i))
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
        context.lineWidth = settings.rays.lineWidth
        for (const angle of angles) {
            const ray = new Ray({
                color: settings.rays.color,
                showPoints: settings.rays.points,
                showRays: settings.rays.rays,
                context,
                x,
                y,
                angle
            })

            ray.march({
                items: circles,
                maxIterationCount: settings.march.reflections,
                maxMarchCount: settings.march.iterations
            })
        }
    }

    function animate({ x, y }: Vector) {
        drawBg()
        if (settings.circles.visible) {
            drawCircles()
        }
        drawRays({ x, y })
    }

    let scheduled: MouseEvent | null = null
    canvas.addEventListener(settings.onlyOnClick ? 'click' : 'mousemove', (event) => {
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
    if (settings.circles.visible) {
        drawCircles()
    }
}

loadDefaultSettingsToDom()

for (const e of Array.from(document.querySelectorAll('input'))) {
    e.addEventListener('change', () => {
        start(loadSettingsFromDom())
    })
}

let resizeTimeout: number
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
        start(loadSettingsFromDom())
    }, 100)
})

start(loadSettingsFromDom())
