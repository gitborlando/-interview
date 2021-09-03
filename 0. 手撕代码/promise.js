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
