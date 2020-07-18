const path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let webpack = require('webpack')
module.exports ={
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve('build'),
		publicPath: 'http://'
	},
	devServer: {
		port: 3000,
		progress: true,
		contentBase: './build',
		compress: true
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html', //以他为模板
			filename: 'index.html',
			hash: true,
			minify: {
				removeAttributeQuotes: true,
				collapseWhitespace: true
			}
		}),
		new MiniCssExtractPlugin({
			filename: 'css/style.css'
		}),
		new webpack.ProvidePlugin({
			$: 'jquery'
		})
	],
	module: {// 模块
		rules: [
			// {
			// 	test: /.css$/,
			// 	// style-loader 把css插入到header中
			// 	// css-loader 解析@import
			// 	// 一个loader一个功能
			// 	use: [{
			// 		loader: 'style-loader',
			// 		options: {
			// 			insert: 'top'
			// 		}
			// 	}, 'css-loader']
			// },
			{
				test: /.js$/,
				use: {
					loader: 'eslint-loader',
					options: {
						enforce: 'pre' // previous 正常是从下到上执行， 加上会先执行
					}
				},
				include: path.resolve('src'),
				exclude: /node_modules/
			},
			{
				test: /.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						// 用babel-loader es6=> es5  预设
						presets: [ // 大插件库 
							'@babel/preset-env'
						],
						plugins: [
							'@babel/plugin-proposal-class-properties',
							'@babel/plugin-transform-runtime'
						]
					}
				},
				include: path.resolve('src'),
				exclude: /node_modules/
			},
			{
				test: /.css$/,
				use: [
					MiniCssExtractPlugin.loader, 
					'css-loader',
					'postcss-loader'
					]
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: 'file-loader'
			}
		]
	}
}