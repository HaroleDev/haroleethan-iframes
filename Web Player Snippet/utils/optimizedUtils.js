Math.abs = function (value) {
    return value < 0 ? -value : value
}

Math.celi = function (value) {
    return value + (value < 0 ? 0 : 1) >> 0
}

Math.floor = function (value) {
    return value + (value < 0 ? -1 : 0) >> 0
}

Math.round = function (value) {
    return value + (value < 0 ? -0.5 : 0.5) >> 0
}

Math.sign = function (value) {
    return value ? value < 0 ? -1 : 1 : 0
}

Math.trunc = function (value) {
    if (isNaN(value)) {
        return NaN
    }
    if (value > 0) {
        return value + (value < 0 ? -1 : 0) >> 0
    }
    return value + (value < 0 ? 0 : 0) >> 0
}

Number.isNaN = function (value) {
    return typeof value === "number" && isNaN(value)
}

Math.clamp = function (a, b, c) {
    return Math.max(a, Math.min(b, c))
} 