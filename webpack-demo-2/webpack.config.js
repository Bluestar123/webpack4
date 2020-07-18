const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = {
	mode: 'development',
	entry: {
		home: './src/home.js',
		index: './src/index.js'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
	// watch: true,
	// watchOptions: {
		
	// },
	resolve: { // 解析 第三方包
		modules: [path.resolve('node_modules')],
		extensions: ['.js','.css'],
		mainFields: ['style', 'main'],
		alias: {
			bootstrap: 'bootstrap/dist/css/bootstrap.css'
		}
	},
	devtool: 'source-map', // 增加映射文件， 调试源代码 eval-source-map
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.css$/,
				use:  ['style-loader', 'css-loader']
			}
		]
	},
	plugins:[
		new webpack.DefinePlugin({
			DEV: "'dev'",
			'process.env: JSON.stringify('production')
		}),
		new HtmlWebpackPlugin({
			template: 'index.html',
			filename: 'home.html',
			chunks: ['home']
		}),
		new HtmlWebpackPlugin({
			template: 'index.html',
			filename: 'index.html',
			chunks: ['index', 'home']
		}),
		new CleanWebpackPlugin({
		  cleanStaleWebpackAssets: false,
		}),
		new CopyWebpackPlugin({
			patterns:[
				{
					from: 'package.json',
					to: './dist'
				}
			]
		}),
		new webpack.BannerPlugin({
			banner: 'sadfsadfsadfsadf'
		})
	]
}