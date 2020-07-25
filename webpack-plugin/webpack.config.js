const path = require('path')	
let donePlugin = require('./plugins/donePlugin.js')
let asyncPlugin = require('./plugins/asyncPlugin.js')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let FileListPlugin = require('./plugins/FileListPlugin.js')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let InlineSourcePlugin = require('./plugins/InlineSourcePlugin')
let UploadPlugin = require('./plugins/UploadPlugin.js')

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: 'build.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: 'www.aaa.com/'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader, 'css-loader'
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'main.css'
		}),
		new donePlugin(),
		new asyncPlugin(),
		new HtmlWebpackPlugin({
			template: './src/index.html'
		}),
		new FileListPlugin({
			filename: 'list.md'
		}),
		// new InlineSourcePlugin({
		// 	match: /\.(js|css)/
		// }),
		new UploadPlugin({
			bucket: '',
			domain: '',
			accessKey: '',
			secretKey: ''
		})
	]
}