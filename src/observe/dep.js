let did = 0
class Dep {
    constructor() {
        this.id = ++did
        this.watchers = []
    }

    depend() {
        Dep.target.addDep(this)
    }

    addWatcher(watcher) {
        this.watchers.push(watcher)
    }
    notify() {
        this.watchers.forEach(watcher => watcher.update())
    }

}
Dep.target = null
export default Dep