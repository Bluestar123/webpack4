let loaderUtils = require('loader-utils')

function loader(source) {
	this.cacheable && this.cacheable()
	// interpolateName获取文件的hash值，并插入值,生成唯一的文件名
	let filename = loaderUtils.interpolateName(this, '[hash].[ext]', {content: source})
	//发射文件，会在dist目录下面生成一个文件
	this.emitFile(filename, source); // 文件  内容
	//把原来的路径变成编译后的路径
	
	return `module.exports = '${filename}'`;
}
// 把 source 转为 二进制
loader.raw = true
module.exports = loader