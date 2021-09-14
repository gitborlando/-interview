class Pub {
  store = {}
  on(ev, cb){
    this.store[ev] = [...(this.store[ev] || []), cb]
  }
  off(ev, cb){
    this.store[ev] = this.store[ev].filter(i => i !== cb)
  }
  emit(ev, ...args){
    this.store[ev].forEach(i => i(...args))
  }
  once(ev, cb){
    this.on(ev, this.foo = (...args) => {
      cb(...args)
      this.off(ev, this.foo)
    })
  }
}
const eventBus = new Pub()
const sleep = (who) => {
  console.log(`${who} is sleeping`)
}
eventBus.once('sleep', sleep)

eventBus.emit('sleep', 'mike-1')
eventBus.emit('sleep', 'mike-2')
