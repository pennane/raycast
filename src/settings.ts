import { isObject } from './util'

export interface SettingsParams {
    onlyOnClick: boolean
    circles: {
        minSize: number
        maxSize: number
        amountFactor: number
        visible: boolean
    }
    rays: {
        lineWidth: number
        amount: number
        rays: boolean
        points: boolean
        color: string
    }
    march: {
        iterations: number
        reflections: number
    }
    shapes: {
        shapeColor: 'random' | string
        shapeColorTransmission: number
    }
}

export function defaultSettings(): SettingsParams {
    return {
        onlyOnClick: false,
        circles: {
            minSize: 20,
            maxSize: 80,
            amountFactor: 23,
            visible: false
        },
        rays: {
            lineWidth: 1,
            amount: 290,
            points: true,
            rays: true,
            color: 'blue'
        },
        march: {
            iterations: 40,
            reflections: 0
        },
        shapes: {
            shapeColor: 'random',
            shapeColorTransmission: 0.65
        }
    }
}

export function loadDefaultSettingsToDom() {
    const settings = defaultSettings()
    for (const [key, value] of Object.entries(settings)) {
        if (isObject(value)) {
            for (const [innerKey, innerValue] of Object.entries(value)) {
                const input = document.getElementById(innerKey) as HTMLInputElement
                if (input.type === 'checkbox') {
                    input.checked = innerValue
                } else {
                    input.value = innerValue
                }
            }
        } else {
            const input = document.getElementById(key) as HTMLInputElement
            if (input.type === 'checkbox') {
                input.checked = value
            } else {
                input.value = value
            }
        }
    }
}

export function loadSettingsFromDom(): SettingsParams {
    const settings: any = {}
    const dSettings = defaultSettings()
    for (const [key, value] of Object.entries(dSettings)) {
        if (isObject(value)) {
            settings[key] = {}
            for (const [innerKey, _innerValue] of Object.entries(value)) {
                const input = document.getElementById(innerKey) as HTMLInputElement
                if (input.type === 'checkbox') {
                    settings[key][innerKey] = input.checked
                } else if (input.type === 'number') {
                    settings[key][innerKey] = Number(input.value)
                } else {
                    settings[key][innerKey] = input.value
                }
            }
        } else {
            const input = document.getElementById(key) as HTMLInputElement
            if (input.type === 'checkbox') {
                settings[key] = input.checked
            } else if (input.type === 'number') {
                settings[key] = Number(input.value)
            } else {
                settings[key] = input.value
            }
        }
    }
    return settings
}

export function useToggler() {
    const toggler = document.getElementById('toggler')!
    const settings = document.getElementById('settings')!
    toggler.addEventListener('click', () => {
        console.log(1)

        settings.classList.toggle('closed')
    })
}
