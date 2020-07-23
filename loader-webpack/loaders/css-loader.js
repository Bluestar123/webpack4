function loader(source) {
	let reg = /url\((.+?)\)/g
	let pos = 0
	let current
	let arr = ['let list = []']
	while(current = reg.exec(source)) {
		let [matchUrl, g] = current // 整体，$1
		// exec  g情况下reg会有lastIndex 属性，截取url(.1.jpg)前一部分，
		let last = reg.lastIndex - matchUrl.length
		arr.push(`list.push(${JSON.stringify(source.slice(pos, last))})`)
		pos = reg.lastIndex
		// 把g替换成require写法
		arr.push(`list.push('url(' + require(${g}) + ')')`)
	}
	arr.push(`list.push(${JSON.stringify(source.slice(pos))})`)
	arr.push(`module.exports = list.join('')`)
	return arr.join('\r\n')
}

module.exports = loader