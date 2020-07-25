// 内联资源   css 使用style标签   js  都放在内部
const HtmlWebpackPlugin = require('html-webpack-plugin')

const pluginName = 'InlineSourcePlugin'
class InlineSourcePlugin {
	constructor({match}) {
	    this.reg = match // 正则
	}
	apply(compiler) {
		// 通过 html-webpackplugin 实现这个功能
		// compilation 当前编译的资源
		compiler.hooks.compilation.tap(pluginName, compilation => {
			HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(pluginName, (data, cb) => {
				// 当前文件的内容都在 compilation 中
				data = this.processTags(data, compilation)
				cb(null, data)
			})
		})
	}
	
	processTags(data, compilation) {
		// 处理引入标签的数据
		let headTags = []
		let bodyTags = []
		// 放在head里面的标签
		data.headTags.forEach(headTag => {
			headTags.push(this.processTag(headTag, compilation))
		})
		data.bodyTags.forEach(bodyTag => {
			bodyTags.push(this.processTag(bodyTag, compilation))
		})
		return {
			...data, headTags, bodyTags
		}
	}
	// 处理某一个标签
	processTag(tag, compilation) {
		console.log(tag)
		let newTag, url
		if (tag.tagName === 'link' && this.reg.test(tag.attributes.href)) {
			newTag = {
				tagName: 'style',
				attributes: { type: 'text/css'}
			}
			url = tag.attributes.href
		}
		if (tag.tagName === 'script' && this.reg.test(tag.attributes.src)) {
			newTag = {
				tagName: 'style',
				attributes: { type: 'application/javascript' }
			}
			url = tag.attributes.src
		}
		
		if (url) {
			// 理解为 虚拟dom， 有tag 的属性
			newTag.innerHTML = compilation.assets[url].source() // 文件内容 放到innerhtml属性中
			// 处理完文件后 删除 文件
			delete compilation.assets[url]
			return newTag
		}
		
		return tag
	}
}

module.exports = InlineSourcePlugin