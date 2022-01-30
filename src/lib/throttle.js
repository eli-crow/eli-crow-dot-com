//MIT https://github.com/wuct/raf-throttle/blob/master/rafThrottle.js
export function rafThrottle(callback) {
    let requestId = null

    let lastArgs

    const later = (context) => () => {
        requestId = null
        callback.apply(context, lastArgs)
    }

    const throttled = function (...args) {
        lastArgs = args
        if (requestId === null) {
            requestId = requestAnimationFrame(later(this))
        }
    }

    throttled.cancel = () => {
        cancelAnimationFrame(requestId)
        requestId = null
    }

    return throttled
}