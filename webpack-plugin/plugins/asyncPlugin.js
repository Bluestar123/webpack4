class AsyncPlugin {
	apply(compiler) {
		compiler.hooks.emit.tapAsync('plugin', (comliation, cb) => {
			setTimeout(() => {
				console.log('等一等')
				cb()
			}, 1000)
		})
		
		
		compiler.hooks.emit.tapPromise('plugin', (comliation) => {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					console.log('promise')
					resolve()
				}, 1000)
			})
		})
	}
}

module.exports = AsyncPlugin