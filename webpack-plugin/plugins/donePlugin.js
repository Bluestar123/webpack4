class DonePlugin {
	constructor(options) {
	    // console.log(11, options)
	}
	apply(compiler) {
		console.log(compiler.options.entry)
		compiler.hooks.done.tap('donePlugin', (stats) => {
			// console.log('done', stats)
		})
	}
}

module.exports = DonePlugin