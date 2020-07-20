let loaderUtils = require('loader-utils')
let validateOption = require('schema-utils')
let fs = require('fs')
function loader(source) {
	// 不用缓存
	this.cacheable(false)
	// 用缓存
	this.cacheable && this.cacheable()
	
	let options = loaderUtils.getOptions(this)
	let schema = {
		type: 'object',
		properties: {
			text: {
				type: 'string'
			},
			filename: {
				type: 'string'
			}
		}
	}
	let cb = this.async()
	// 前两个参数对比，对应的名字和类型是否一致。 第三个参数名字，告诉是在那个文件的
	validateOption(schema, options, 'banner-loader')
	if(options.filename) {
		// watch:true 状态时， 如果文件改变了也会触发重新编译
		this.addDependency(options.filename)
		fs.readFile(options.filename, 'utf8', function (err, data) {
			cb(err, `/*${data}*/${source}`)
		})
	} else {
		cb(null, `/*${options.text}*/${source}`)
	}
}

module.exports = loader