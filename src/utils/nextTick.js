
const callbacks = []
let waiting = false

let timerFunc = null

if (typeof Promise !== 'undefined') {
    timerFunc = () => Promise.resolve().then(flushCallbacks)
} else if (typeof setImmediate !== 'undefined') {
    setImmediate(flushCallbacks)
} else{
    setTimeout(flushCallbacks)
}


function flushCallbacks() {
    callbacks.forEach(cb => cb())
    waiting = false
}
function nextTick(cb) {
    callbacks.push(cb)
    if (!waiting) {
        timerFunc()
        waiting = true
    }
}

export default nextTick