//MIT https://github.com/wuct/raf-throttle/blob/master/rafThrottle.js
export function rafThrottle(callback: Function) {
    let requestId: number = -1

    let lastArgs: any[]

    const later = (context: any) => () => {
        requestId = -1
        callback.apply(context, lastArgs)
    }

    const throttled = function (this: Function, ...args: any[]) {
        lastArgs = args
        if (requestId === -1) {
            requestId = requestAnimationFrame(later(this))
        }
    }

    throttled.cancel = () => {
        cancelAnimationFrame(requestId)
        requestId = -1
    }

    return throttled
}