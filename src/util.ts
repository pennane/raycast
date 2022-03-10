export function randomInteger(min: number, max: number) {
    return Math.random() * (max - min) + min
}

export function degToRad(degrees: number): number {
    return degrees * (Math.PI / 180)
}
