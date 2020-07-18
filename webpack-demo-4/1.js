let {SyncHook} = require('tapable')

// waterfallhook 上一个执行的返回结果  给到下一个执行

class lesson {
	constructor() {
		this.hooks = {
			arch: new SyncHook(['name'])
		}
  }

  tap() {
    // 注册监听函数
    this.hooks.arch.tap('node', (name) => {
      console.log('node', name)
	  // return 不是undefined 就停止运行
    })
    this.hooks.arch.tap('react', (name) => {
      console.log('react', name)

    })
  }

  start() {
    // call 执行
    this.hooks.arch.call('aaaa')
  }
}

let l = new lesson()
l.tap()
l.start() // 启动钩子