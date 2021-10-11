import arrayPrototype from "./array";
import Dep from "./dep";



class Observer {
  constructor(data) {
    this.dep = new Dep()
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false
    })
    if (Array.isArray(data)) {
      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }

  observeArray(array) {
    Object.setPrototypeOf(array, arrayPrototype)
    array.forEach(item => observe(item))
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

function dependArray(arr) {
  arr.forEach(item => {
   const ob = item.__ob__
    if (ob) {
      ob.dep.depend()
    }
    if (Array.isArray(item))
      dependArray(item)
  })
}

function defineReactive(data, key, value) {
  const dep = new Dep()
  let childOb = observe(value)
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        dep.depend()
        if (Array.isArray(value)) {
            childOb.dep.depend()
            dependArray(value)
        }
      }

      return value
    },
    set(newValue) {
      if (value !== newValue) {
        childOb = observe(newValue)
        value = newValue
        dep.notify()
      }
    }
  })
}


export function observe(data) {
  if (typeof data !== 'object' || data === null)
    return
  if (data.__ob__)
    return
  return new Observer(data)
}

