// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

'use strict'

const printErrors = function (errors, duration) {
    const ol = document.getElementsByTagName('ol')[0]
    const p = document.getElementById('status')
    const errorsLength = errors.length
    ol.textContent = ''

    if (errorsLength > 0) {
        if (errorsLength === 1) {
            p.textContent = 'Almost there!'
        } else if (errorsLength < 5) {
            p.textContent = 'Just a few more mistakes.'
        } else {
            p.textContent = 'You are hopeless, RTFS.'
        }

        for (let i = 0; i < errorsLength; i++) {
            const error = errors[i]
            let message = 'Line ' + error.line
            const li = document.createElement('li')
            const column = error.col
            if (column) {
                message += ', column ' + column
            }

            li.textContent = message + ': ' + error.message
            ol.appendChild(li)
        }
    } else {
        p.textContent = 'This is boring, your WebVTT is valid!'
    }
    p.textContent += ' (' + duration + 'ms)'
}

const debug = function (url) {
    const hmm = url.slice(url.indexOf('#')) == '#debug'
    document.getElementsByTagName('pre')[0].hidden = !hmm
}

const printWebVTTFile = function (r) {
    const pre = document.getElementsByTagName('pre')[0]
    const s = new WebVTTSerializer()
    pre.textContent = s.serialize(r.cues, r.metadatas)
}

const toTimestamp = function (timestamp) {
    let seconds = 0
    let secondsFrac = 0
    let minutes = 0
    let hours = 0

    secondsFrac = (timestamp % 1).toFixed(3) * 1000
    seconds = Math.floor(timestamp)
    if (seconds > 59) {
        minutes = (seconds / 60).toFixed(0)
        seconds = (seconds % 60).toFixed(2)
    }
    if (minutes > 59) {
        hours = (minutes / 60).toFixed(0)
        minutes = (minutes % 60).toFixed(2)
    }
    return {
        hours,
        minutes,
        seconds,
        secondsFrac
    }
}

var printTimestamp = function (timestamp) {
    const components = toTimestamp(parseFloat(timestamp))
    let result = ''
    if (components.hours > 0) {
        if (components.hours < 10) {
            result += '0'
        }
        result += components.hours + ':'
    }
    if (components.minutes < 10) {
        result += '0'
    }
    result += components.minutes + ':'
    if (components.seconds < 10) {
        result += '0'
    }
    result += components.seconds + '.'
    if (components.secondsFrac < 100) {
        result += '0'
    }
    if (components.secondsFrac < 10) {
        result += '0'
    }
    result += components.secondsFrac
    return result
}

export { printTimestamp }
