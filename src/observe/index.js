import arrayPrototype from "./array";



class Observer {
  constructor(data) {
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

function defineReactive(data, key, value) {
  observe(value)
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      if (value !== newValue) {
        observe(newValue)
        value = newValue
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

