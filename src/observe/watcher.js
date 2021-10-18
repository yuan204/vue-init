import Dep from "./dep";
import {queueWatcher} from "./schedular";
let wid = 0
class Watcher {
    constructor(vm, expOrFn, cb, options = {}) {
        this.vm = vm
        this.cb = cb

        this.id = ++wid
        this.depIds = new Set()
        this.deps = []
        this.getter = expOrFn
        this.user = !!options.user
        if (typeof expOrFn === 'string') {
            this.getter = () => {
                return expOrFn.split('.').reduce((previousValue, currentValue) => previousValue[currentValue], vm)
            }
        }
        this.value = this.get()
    }

    get() {
        Dep.target = this
        const value = this.getter()
        Dep.target = null
        return value
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
        // console.log('run')
        const oldValue = this.value
        const newValue = this.get()
        this.value = newValue
        if (this.user) {
            this.cb.call(this.vm, newValue, oldValue)
        }
    }
}

export default Watcher