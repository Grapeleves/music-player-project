export default function (fn, delay = 300) {
    let timer = null
    return function (...args) { // 如果函数传参了
      return new Promise(resolve => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          const res = fn.apply(this, args)
          resolve(res)
        }, delay)
      })
    }
  }