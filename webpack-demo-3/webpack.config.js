const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const NoConsole = require('./plugins/NoConsole')
const Happypack = require('happypack')
module.exports = {
	mode: 'development',
	entry: './src/test.js',
	output: {
		filename:'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devServer:{
		port: 3000,
		open: true,
		contentBase: './dist'
	},
	module: {
		noParse: /jquery/,
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				include: path.resolve('src'),
				use: 'happypack/loader?id=js',//js要多线程打包
			}
		]
	},
	plugins: [
		// new Happypack({
		// 	id: 'css',
		// 	use: ['style-loader', 'css-loader']
		// }),
		new Happypack({
			id: 'js',
			use: [{
				loader: 'babel-loader',
				options: {
					presets: [
						'@babel/preset-env',
						'@babel/preset-react'
					]
				}
			}]
		}),
		new webpack.DllReferencePlugin({
			manifest: path.resolve(__dirname, 'dist', 'manifest.json')
		}),
		// new webpack.IgnorePlugin(),
		new HtmlWebpackPlugin({
			template: './public/index.html'
		}),
		new NoConsole(),
		new webpack.NamedModulesPlugin(), // 打印更新的模块路径
		new webpack.HotModuleReplacementPlugin()// 热更新插件
	]
}