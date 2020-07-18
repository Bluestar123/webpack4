let name = 'Test'

class Test {
	constructor(arg) {
	}
	apply(compiler) {
		const { context, entry } = compiler.options
		console.log('context', context)
		console.log('entry', entry)
		compiler.hooks.run.tap(name, function(compiler) {
			console.log('开始编译了')
		})
		
		compiler.hooks.entryOption.tap(name, () => {
			console.log(11, context, entry)
		})
		
		compiler.hooks.done.tap(name, function(stats) {
			console.log('打包完成了')
		})
	}
}
module.exports = Test