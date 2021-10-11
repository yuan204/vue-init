import Dep from "./dep";
import {queueWatcher} from "./schedular";
let wid = 0
class Watcher {
    constructor(vm, fn) {
        this.vm = vm
        this.fn = fn
        this.id = ++wid
        this.depIds = new Set()
        this.deps = []
        this.get()
    }

    get() {
        Dep.target = this
        this.fn()
        Dep.target = null
    }
    addDep(dep) {
        if (!this.depIds.has(dep.id)) {
            this.depIds.add(dep.id)
            this.deps.push(dep)
            dep.addWatcher(this)
        }
    }
    update() {
        queueWatcher(this)
    }
    run() {
        console.log('run')
        this.get()
    }
}

export default Watcher