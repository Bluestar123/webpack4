let babel = require('@babel/core')	
let loaderUtils = require('loader-utils')
	
function loader(source) {
	// loader 中的this   loaderContext
	let options = loaderUtils.getOptions(this)
	let cb = this.async() // 自带的异步执行
	babel.transform(source, {
		...options,
		sourceMap: true,
		filename: this.resourcePath.split('/').pop() // 文件名
	}, function(err, result) {
		// 异步回调
		// 两个参数， 第一个如果添加内容会报错
		// 错误 代码  sourcemap
		cb(err, result.code, result.map)
	})
}

module.exports = loader