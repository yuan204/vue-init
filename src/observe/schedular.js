import nextTick from "../utils/nextTick";

let queues = []
let has = {}
let pending = false

function flushQueues() {
    queues.forEach(watcher => watcher.run())
    queues = []
    has = {}
    pending = false
}

export function queueWatcher(watcher) {
    if (!has[watcher.id]) {
        has[watcher.id] = true
        queues.push(watcher)
    }
    if (!pending) {
        nextTick(flushQueues)
        pending = true
    }
}