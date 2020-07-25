class FileListPlugin {
	constructor({filename}) {
	    this.filename = filename
	}
	apply(compiler) {
		// 文件准备好了要进行发射
		compiler.hooks.emit.tap('plugin', (compilation) => {
			let assets = compilation.assets 
			let content = `## 文件名     资源大小\r\n`
			Object.entries(assets).forEach(([filename, statObj]) => {
				content += `- ${filename} ${statObj.size()}\r\n`
			})
			assets[this.filename] = {
				source() {
					return content
				},
				size() {
					return content.length
				}
			}
		})
	}
}

module.exports = FileListPlugin