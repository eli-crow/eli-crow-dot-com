//MIT https://github.com/wuct/raf-throttle/blob/master/rafThrottle.js
export function rafThrottle(callback: Function) {
    let requestId = null

    let lastArgs: any[]

    const later = (context) => () => {
        requestId = null
        callback.apply(context, lastArgs)
    }

    const throttled = function (...args: any[]) {
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