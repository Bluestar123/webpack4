let path = require('path')
let NoConsole = require('./plugins/NoConsole')
let webpack = require('webpack')

module.exports = {
	mode: 'development',
	optimization: {
		splitChunks: { // 分割代码块  多入口
			cacheGroups: { // 缓存组
				common: { // 公共模块 引用的文件
					minSize: 0, // 大小是多少 抽离
					minChunks: 2, // 被引用1次以上 抽离
					chunks: 'initial',
				},
				vendor: {
					priority: 1,// 权重。优先抽离
					// 第三方模块
					test: /node_modules/, // 中的文件都抽离
					chunks: 'initial', // 入口开始
					minSize: 0, // 大小是多少 抽离
					minChunks: 2,
				}
			}
		}
	},
	entry: {
		react: ['react', 'react-dom']
	},
	output:{
		filename: '_dll_[name].js',
		path:path.resolve(__dirname, 'dist'),
		library: '_dll_[name]', // 打包文件执行 返回的结果
		// libraryTarget: 'commonjs' // umd commonjs var this  var ab = 文件结果
	},
	plugins: [
		new webpack.DllPlugin({
			name: '_dll_[name]',
			path: path.resolve(__dirname, 'dist', 'manifest.json')
		}),
		new NoConsole()
	]
}