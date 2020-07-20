let path = require('path')
module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output:{
		filename: 'build.js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: 'source-map',
	resolveLoader: {
		modules: ['node_modules', path.resolve(__dirname, 'loaders')]
	},
	// loader 分类 enforce pre在前面的    post 在后面的    normal
	/**
	 * 默认执行顺序 从下到上  从右到左
	 * loader的顺序 pre 》 normal 》 inline 》 post
	 * 
	 * -! 不会让文件再去通过 pre + normal loader去处理
	 * let str = require('-!inline-loader!./a.js')
	 * */
	module: {
		rules: [
			{
				test: /\.jpg$/,
				//  目的根据图片生成一个md5， 发射到dist 目录下，file-loader 还会返回当前的图片路径
				use: {
					loader: 'url-loader',
					options: {
						limit: 200*300
					}
				}
			},
			{
				test: /\.js$/,
				use: { /*测不准*/
					loader: 'banner-loader',
					options: {
						text: '测不准',
						filename: path.resolve(__dirname, 'banner.js'), // 模板
					}
				}
			}
			// {
			// 	test: /\.js$/,
			// 	use: {
			// 		loader: 'babel-loader',
			// 		options: {
			// 			presets: [
			// 				'@babel/preset-env'
			// 			]
			// 		}
			// 	}
			// }
		]
	}
}