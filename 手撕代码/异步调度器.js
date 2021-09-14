/**
* 1.
*/
class Scheduler {
  constructor(limit) {
    this.limit = limit
    this.count = 0
    this.queue = []
  }
  async add(task) {
    if (this.count >= this.limit) {
      await new Promise((resolve) => this.queue.push(resolve))
    }
    this.count++
    await task()
    this.count--
    this.queue.length && this.queue.shift()()
  }
}

const scheduler = new Scheduler(2)

for (let i = 0; i < 7; i++) {
  scheduler.add(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(7 - i)
        resolve()
      }, Math.abs(7 - i) * 1000)
    })
  })
}

/**
 * 2.
 */
function scheduler(limit) {
  const state = {
    limit,
    count: 0,
    queue: []
  }
  return async (task) => {
    if (state.count >= state.limit) {
      await new Promise((resolve) => state.queue.push(resolve))
    }
    state.count++
    await task()
    state.count--
    state.queue.length && state.queue.shift()()
  }
}

const add = scheduler(2)

for (let i = 0; i < 7; i++) {
  add(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(7 - i)
        resolve()
      }, Math.abs(7 - i) * 1000)
    })
  })
}

/**
 * 3.
 */
class Scheduler {
  constructor() {
    this.queue = []
    this.count = 0
    this.fire = ""
    this.isFire = 0
  }
  task(time, fn) {
    this._add(time, fn)
    return this
  }
  async _add(time, fn) {
    if (this.count === 1) {
      await new Promise((resolve) => this.queue.push(resolve))
    }
    this.count = 1
    !this.isFire && (await new Promise((resolve) => (this.fire = resolve)))
    await this._promisify(time, fn)
    this.queue.length && this.queue.shift()()
  }
  _promisify(time, fn) {
    return new Promise((resolve) => {
      setTimeout(() => {
        fn()
        resolve()
      }, time)
    })
  }
  start() {
    this.fire()
    this.isFire = true
  }
  stop() {
    this.queue = []
  }
}

const scheduler = new Scheduler()
let start = new Date().getSeconds()

scheduler
  .task(1000, () => {
    console.log(1 + "---" + (new Date().getSeconds() - start))
  })
  .task(2000, () => {
    console.log(2 + "---" + (new Date().getSeconds() - start))
  })
  .task(1000, () => {
    console.log(3 + "---" + (new Date().getSeconds() - start))
  })

scheduler.start()


/**
 * repeat(console.log, 4, 2000)
 */
function repeat(fn, time, delay){
  return (arg) => {
    for(let i = 0; i < time; i++){
      setTimeout(() => {
        fn(arg)
      }, delay * (i + 1));
   }
  }
}

repeat(console.log, 4, 2000)('hello world')