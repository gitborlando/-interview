### Promise

解决回调地狱的一种方式

#### Promise.all

接受一个promise队列, 然后并行执行这里面的的异步任务, 返回一个promise实例, 如果全都成功执行就返回一个结果数组, 失败就返回最先失败的任务的结果

```js
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
```

值得注意的是, promise.all成功时返回的结果数组的顺序和接受的任务队列的顺序一致

#### promise.race

同样接受一个任务队列, 只是那个任务线跑完就返回那个的结果, 不管成功还是失败

```js
const Race = (promises) => {
  return new Promise(function (resolve, reject) {
    promises.forEach(p => Promise.resolve(p)
      .then(data => resolve(data), err => reject(err)))
  })
}
```





