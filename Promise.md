### Promise

解决回调地狱的一种方式

#### Promise.all

接受一个promise队列, 然后并行执行这里面的的异步任务, 返回一个promise实例, 如果全都成功执行就返回一个结果数组, 失败就返回最先失败的任务的结果

```js
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
```

值得注意的是, promise.all成功时返回的结果数组的顺序和接受的任务队列的顺序一致

#### promise.race

同样接受一个任务队列, 只是哪个任务线跑完就返回那个的结果, 不管成功还是失败

```js
const Race = (promises) => {
  return new Promise(function (resolve, reject) {
    promises.forEach(p => Promise.resolve(p)
      .then(data => resolve(data), err => reject(err)))
  })
}
```

#### promise.allSettled

即不管成功失败, 都会等所有 promise 执行完, 之后再返回一个包含结果的对象数组, 每个结果对象都有一个 status 字段, 说明这个任务是 fulfilled 还是 rejected, 然后成功的话是包含一个value字段指向返回的值, 失败的话则是reason字段, 说明失败的原因

```js
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
```



**`Promise.allSettled()` 更适合：**

- 彼此不依赖，其中任何一个被 `reject` ，对其它都没有影响
- 期望知道每个 `promise` 的执行结果

**`Promise.all()` 更适合：**

- 彼此相互依赖，其中任何一个被 `reject` ，其它都失去了实际价值

#### promise.finally

即一个 promise 不管其成功还是失败都一定会执行的回调



