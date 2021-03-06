let loaderUtils = require('loader-utils')
let mime = require('mime')
function loader(source) {
	console.log(source.length)
	let options = loaderUtils.getOptions(this)
	if (options.limit && options.limit > source.length) {
		return `module.exports = "data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}"`
	}else{
		return require('./file-loader').call(this, source)
	}
	return source
}
loader.raw = true
module.exports = loader