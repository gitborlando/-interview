/**
 * new 操作符
 */
const New = (ctor, ...args) => {
  const instance = Object.create(ctor.prototype)
  const res = ctor.apply(instance, args)
  return typeof res === 'object' ? res : instance
}