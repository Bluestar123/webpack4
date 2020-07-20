function loader(source) { // 参数是源代码
	console.log('loader2')
	return source
	
}
module.exports = loader