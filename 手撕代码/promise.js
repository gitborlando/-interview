/**
 * Promise.all
 */
const All = (arr) => {
  const res = []
  return new Promise((resolve, reject) => {
    arr.forEach((p, i) => {
      Promise.resolve(p).then((val) => {
        res[i] = val
        if (i === arr.length) resolve(res)
      }).catch(reject)
    })
  })
}

const AllSettled = (promises) => {
  let count = 0
  return new Promise((resolve) => {
    promises.forEach(function(promise){
      Promise.resolve(promise).then(
        value => (this[count++] = { status: 'fulfilled', value }),
        reason => (this[count++] = { status: 'rejected', reason }),
      ).finally(() => { count === promises.length && resolve(this) })
    }, [])
  })
}

const All = (promises) => {
  let count = 0
  return new Promise((resolve, reject) => {
    promises.forEach(function(promise){
      Promise.resolve(promise)
        .then(val => (this[count++] = val))
        .catch(reject)
        .finally(() => count === promises.length && resolve(this))
    }, [])
  })
}

const promisify = (delay, str, type) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`${type}---${str}`)
      type === 'resolve' ? resolve(str) : reject(str)
    }, delay);
  })
}

const promises = [
  promisify(300, 'a', 'resolve'),
  promisify(700, 'b', 'resolve'),
  promisify(500, 'c', 'reject')
];


AllSettled(promises).then(res => {
  console.log(res)
})

All(promises).then(res => {
  console.log(res)
}).catch(err => console.log(err))

