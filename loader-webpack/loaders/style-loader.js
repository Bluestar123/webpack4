let loaderUtils = require('loader-utils')

function loader(source) {
	console.log(11111111111111)
	// 在 style-loader 中 导出一个脚本
	let str = `
		let style = document.createElement('style')
		style.innerHTML = ${JSON.stringify(source)}
		document.head.appendChild(style)
	`
	return str
}

// 在style-loader 上谢了 pitch
// style-loader less-loader css-loader

// 处理完了 style-loader       less-loader!css-loader!./index.less

// loader 不执行了
loader.pitch = function (remainingRequest) {// 剩余请求
console.log(2222222222222)
	// 让style-loader 去处理less-loader!css-loader/./index.less
	// 取相对路径，  !! 不要再引用以前的，不会循环引用
	let str = `
		let style = document.createElement('style');
		style.innerHTML = require(${loaderUtils.stringifyRequest(this, '!!' + remainingRequest)});
		document.head.appendChild(style);
	`
	return str
}

// pitch 的执行顺序是 从左往右， 和 loader相反。 
/* 
因为  
 */

module.exports = loader