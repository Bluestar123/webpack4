class SyncHook {
  constructor(args) {
    this.tasks = []
  }
  call(...args) {
    // this.tasks.forEach(task => task(...args))
	// let ret // 当前函数的返回值
	// let index = 0 // 当前执行的函数索引
	
	// do {
	// 	ret = this.tasks[index++](...args)
	// }while(ret == undefined && index < this.tasks.length)
	let [first, ...others] = this.tasks
	let ret = first(...args)
	others.reduce((a, b) => {
		return b(a) // return 的就是上一个
	}, ret)
  }
	
  tapPromise(...args) {
	  let [first, ...others] = this.tasks
	  return others.reduce((p, n) => {
		  return p.then(() => n(...args))
	  }, first(...args))
  }
	
  tap(name, task) {
    this.tasks.push(task)
  }
}

let hook = new SyncHook(['name'])

hook.tap('react', a => {
  console.log('react', a)
})

hook.call('aa')