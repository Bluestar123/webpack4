const { resolve }  = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MinaWebpackPlugin = require('./plugin/MinaWebpackPlugin')
const Test = require('./plugin/Test')
const NoConsole = require('./plugin/NoConsole')
const MinaRuntimePlugin = require('./plugin/MinaRuntimePlugin')
const LodashWebpackPlugin = require('lodash-webpack-plugin')

const debuggable = process.env.BUILD_TYPE !== 'release'

console.log(`环境：${process.env.NODE_ENV} 构建类型：${process.env.BUILD_TYPE}`)


module.exports = {
	context: resolve('src'),
	// entry: {
	// 	'app': './app.js',
	// 	'pages/index/index': './pages/index/index.js',
	// 	'pages/logs/logs': './pages/logs/logs.js'
	// },
	entry: './app.js',
	output: {
		path: resolve('dist'),
		filename: '[name].js',
		globalObject: 'wx'
	},
	//要把这些公共代码分离到一个独立的文件当中
	optimization: {// 提取公共代码
		splitChunks: {
			chunks: 'all',
			name: 'common',
			minChunks: 2,
			minSize: 0
		},
		/*
			它的作用是将包含chunks 映射关系的 list单独从 app.js里提取出来，因为每一个 chunk 的 id 基本都是基于内容 hash 出来的，所以你每次改动都会影响它，如果不将它提取出来的话，等于app.js每次都会改变。缓存就失效了。
		**/
		runtimeChunk: {
			name: 'runtime'
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: "babel-loader"
			},
			{
				test: /\.(scss)$/,
				include: /src/,
				use: [
					// {
					// 	loader: 'file-loader',
					// 	options: {
					// 		useRelativePath: true,
					// 		name: '[path][name].wxss',
					// 		context: resolve('src')
					// 	}
					// },
					{
						loader: 'sass-loader',
						options: {
							// includePaths: [resolve('src', 'styles'), resolve('src')]
						}
					}
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin({
			cleanStaleWebpackAssets: false
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: '**/*',
					to: './',
					globOptions: {
						ignore: ['**/*.js', '**/*.scss']
					}
				}
			]
		}),
		new webpack.EnvironmentPlugin({
			NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'development',
			BUILD_TYPE: JSON.stringify(process.env.BUILD_TYPE) || 'debug'
		}),
		new MinaWebpackPlugin({
			scriptExtensions: ['.js'],
			assetExtensions: ['.scss']
		}),
		new MinaRuntimePlugin(),
		new LodashWebpackPlugin(),
		new Test(),
		new NoConsole()
	],
	mode: debuggable ? 'none' : 'production',
	devtool: debuggable ? 'inline-source-map' : 'source-map'
}