let name = 'no-console'

class NoConsole {
	constructor(options) {
		this.options = options
		this.externalModules = {}
	}
	apply(compiler) {
		var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)|(\/\*\*\*\*\*\*\/)/g
	
		compiler.hooks.emit.tap(name, compilation => {
			console.log(compilation.assets)
			Object.keys(compilation.assets).forEach(data => {
				let content = compilation.assets[data].sourse() // 预处理的文本
				content = content.replace(reg, word => {
					return /^\/{2,}/.test(word) || /^\/\*!/.test(word) || /^\/\*{3,}\//.test(word) ? "" : word;
				})
				compilation.assets[data] = {
					source() {
						return content
					},
					size() {
						return content.length
					}
				}
			})
		})
	}
}

module.exports = NoConsole