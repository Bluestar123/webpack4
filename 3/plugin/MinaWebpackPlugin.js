const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin')
const MultiEntryPlugin = require('webpack/lib/MultiEntryPlugin')
const path = require('path')
const fs = require('fs')
const replaceExt = require('replace-ext')

const assetsChunkName = '__assets_chunk_name__'

// 增加插件的方法
function itemToPlugin(context, item, name) {
	if (Array.isArray(item)) {
		console.log(22222222222)
		return new MultiEntryPlugin(context, item, name)
	}
	// 传入要处理的入口
	return new SingleEntryPlugin(context, item, name)
}

function _inflateEntrues(entries = [], dirname, entry) {
	const configFile = replaceExt(entry, '.json')
	const content = fs.readFileSync(configFile, 'utf8')
	const config  = JSON.parse(content) // json文件是对象
	
	;['pages', 'usingComponents'].forEach(key => {
		const items = config[key]
		if (typeof items === 'object') {
			Object.values(items).forEach(item => inflateEntries(entries, dirname, item))
		}
	})
}

function inflateEntries(entries, dirname, entry) {
	entry = path.resolve(dirname, entry)
	if (entry != null &&!entries.includes(entry)) {
		entries.push(entry)
		_inflateEntrues(entries, path.dirname(entry), entry)
	}
}

function first(entry, extensions) {
	for(const ext of extensions) {
		const file = replaceExt(entry, ext)
		if (fs.existsSync(file)) {
			return file
		}
	}
	return null
}

function all(entry, extensions) {
	const items = []
	for (const ext of extensions) {
		const file = replaceExt(entry, ext)
		if (fs.existsSync(file)) {
			items.push(file)
		}
	}
	return items
}

class MinaWebpackPlugin {
	constructor(options = {}) {
		this.scriptExtensions = options.scriptExtensions || ['.ts', '.js']
		this.assetExtensions = options.assetExtensions || []
		this.entries = []
	}
	
	// apply(compiler) {
	// 	// 获取 config.js 中的配置
	// 	const { context, entry } = compiler.options
	// 	// 找入口文件放entries 里面
	// 	inflateEntries(this.entries, context, entry)
	// 	compiler.hooks.entryOption.tap('MinaWebpackPlugin', () => {
	// 		this.entries
	// 		// 是app.json中的pages 和 app.js  都添加 js拓展名
	// 		.map(item => replaceExt(item, '.js'))
	// 		// 换成相对路径
	// 		.map(item => path.relative(context, item))
	// 		// 添加入口文件， 
	// 		//app: './app.js'  ,
	// 		//'pages/index/index': './pages/index/index/js'
	// 		//new LogPlugin(args).apply(compiler)将插件注册到Compiler生命周期中的任何特定的挂钩事件
	// 		//compiler.apply()去注册他们.
	// 		// compiler 启动
			
	// 		// compiler.run(callback)
	// 		// 最后一定要注册到 compiler上， plugin.apply(compiler)
	// 		.forEach(item => itemToPlugin(context, './' + item, replaceExt(item, '')).apply(compiler))
	// 		// entryOption 返回true 告诉webpack 内置插件不要处理入口文件，因为已经处理了
	// 		return true
	// 	})
	// }
	
	applyEntry(compiler, done) {
		const { context } = compiler.options
		const assets = this.entries
			.map(item => first(item, this.scriptExtensions))
			.map(item => path.relative(context, item))
		.forEach(item => itemToPlugin(context, './' + item, replaceExt(item, '')).apply(compiler))
		
		itemToPlugin(context, assets, assetsChunkName).apply(compiler)
		if (done) {
			done()
		}
	}
	
	apply(compiler) {
		const {context, entry} = compiler.options
		inflateEntries(this.entries, context, entry)
		
		compiler.hooks.entryOption.tap('MinaWebpackPlugin', () => {
			this.applyEntry(compiler)
			return true
		})
		
		// 监听watchRun 事件
		compiler.hooks.watchRun.tap('MinaWebpackPlugin', (compiler, done) => {
			this.applyEntry(compiler, done)
		})
		
		compiler.hooks.compilation.tap('MinaWebpackPlugin', compilation => {
			compilation.hooks.beforeChunkAssets.tap('MinaWebpackPlugin', () => {
				const assetsChunkIndex = compilation.chunks.findIndex(({name}) => name === assetsChunkName)
				if (assetsChunkIndex > -1) {
					compilation.chunks.splice(assetsChunkIndex, 1)
				}
			})
		})
	}
}

module.exports = MinaWebpackPlugin