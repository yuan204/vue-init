const arrayProto = Object.create(Array.prototype)

const methods = [
  'push',
  'pop',
  'splice',
  'unshift',
  'shift',
  'reverse',
  'sort'
]

methods.forEach(method => {
  arrayProto[method] = function (...args) {
    console.log('array proxy')
    const result = Array.prototype[method].apply(this, args)
    const ob = this.__ob__
    let inserted = null
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
      default:
        break
    }
    if (inserted)
      ob.observeArray(inserted)
    return result
  }
})

export default arrayProto


