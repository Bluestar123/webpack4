const path = require('path')
const ensurePosix = require('ensure-posix-path')
const { ConcatSource } = require('webpack-sources')
const requiredPath = require('required-path')

function isRuntimeExtracted(compilation) {
	return compilation.chunks.some(chunk => chunk.isOnlyInitial() && chunk.hasRuntime() && !chunk.hasEntryModule())
}

function script({dependencies}) {
	return ';' + dependencies.map(file => `require('${requiredPath(file)}');`).join('')
}

module.exports = class MinaRuntimeWebpackPlugin {
	constructor(options = {}) {
		this.runtime = options.runtime || ''
	}
	
	apply(compiler) {
		compiler.hooks.compilation.tap('MinaRuntimeWebpackPlugin', compilation => {
			for (let template of [compilation.mainTemplate, compilation.chunkTemplate]) {
				
				template.hooks.renderWithEntry.tap('MinaRuntimeWebpackPlugin', (source, entry) => {
					if (!isRuntimeExtracted(compilation)) {
						throw new Error(
						[
							'Please reuse the runtime chunk to avoid duplicate loading of javascript files.',
							"Simple solution: set `optimization.runtimeChunk` to `{ name: 'runtime.js' }` .",
							'Detail of `optimization.runtimeChunk`: https://webpack.js.org/configuration/optimization/#optimization-runtimechunk .',
						].join('\n'))
					}
					
					// 如果不是入口chunk 不是通过compilation.addEntry 添加的模块生成的chunk，就不管了
					if (!entry.hasEntryModule) {
						return source
					}
					
					let dependencies = []
					// 知道入口chunk 依赖的其他chunk
					entry.groupsIterable.forEach(group => {
						group.chunks.forEach(chunk => {
							let filename = ensurePosix(path.relative(path.dirname(entry.name), chunk.name))
							if (chunk === entry || !dependencies.indexOf(filename)) {
								return
							}
							dependencies.push(filename)
						})
					})
					
					// 在源码前面拼接runtime及公共代码依赖
					source = new ConcatSource(script({ dependencies }), source)
					
					return source
				})
				
				
			}
		})
	}
}