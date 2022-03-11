export function randomInteger(min: number, max: number) {
    return Math.random() * (max - min) + min
}

export function seededRandomInteger(generator: () => number, min: number, max: number) {
    return generator() * (max - min) + min
}

export function degToRad(degrees: number): number {
    return degrees * (Math.PI / 180)
}

export function isObject(a: any): a is object {
    return typeof a === 'object' && !Array.isArray(a) && a !== null
}

export function mulberry32(a: number) {
    return function () {
        var t = (a += 0x6d2b79f5)
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}
