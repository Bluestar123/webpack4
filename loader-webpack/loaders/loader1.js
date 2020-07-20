function loader(source) { // 参数是源代码
	console.log('loader1')
	return source
}
module.exports = loader