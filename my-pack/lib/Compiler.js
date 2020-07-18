let fs = require('fs')
let path = require('path')
let { parse } = require('@babel/parser')
let generator = require('@babel/generator').default
let traverse = require('@babel/traverse').default
let t = require('@babel/types')
let { SyncHook } = require('tapable')

// @babel/parser 转换为 ast 
// babel-traverse 遍历
// babel-types 把找到的节点替换
// @babel/generator
class Compiler{
	constructor(config) {
		// entry output
	    this.config = config
		// 需要保存入口文件的路径
		this.entryId
		// 保存所有模块依赖
		this.modules = {}
		this.entry = config.entry // 入口文件路径
		this.root = process.cwd() // 工作路径  文件的根目录  执行node命令的文件夹路径
		
		this.hooks = {
			entryOptions: new SyncHook(),// 入口选项
			compile: new SyncHook(), // 编译时候
			afterCompile: new SyncHook(), // 编译之后
			afterPlugins: new SyncHook(), // 编译完插件后
			run: new SyncHook(), // 运行时候执行
			emit: new SyncHook(), // 发射文件
			done: new SyncHook() // 完成
		}
		
		// 如果传了plugins 
		let  plugins = this.config.plugins
		if (Array.isArray(plugins)) {
			plugins.forEach(plugin => {
				plugin.apply(this)
			})
		}
		this.hooks.afterPlugins.call()
	}
	getSource(modulePath) {
		// 处理loader中的文件匹
		let content = fs.readFileSync(modulePath, 'utf8')
		let rules = this.config.module.rules
		for(let i =0;i < rules.length; i++) {
			let rule = rules[i]
			let { test, use} = rule
			let len = use.length - 1
			if (test.test(modulePath)) {
				// 模块需要通过loader 转化
				function normalLoader() {
					let loader = require(use[len--]) // 获取loader函数
					content = loader(content)
					if (len >= 0) {
						normalLoader()
					}
				}
				normalLoader()
			}
		}
		
		return content
	}
	// 需要 ast 语法树解析
	parse(source, parentPath) {
		// 解析代码成 树
		let ast = parse(source)
		let dependencies = [] // 依赖的数组, 会依赖好多个模块
		traverse(ast, {
			// 调用表达式
			CallExpression(p) {
				let node = p.node // 对应的节点
				if(node.callee.name == 'require') {
					node.callee.name = '__webpack_require__'
					let moduleName = node.arguments[0].value // 拿到模块的引用名 ./a.js
					// 没有扩展名 补上js
					moduleName = moduleName + (path.extname(moduleName)?'':'.js')
					moduleName = './' + path.join(parentPath, moduleName)
					dependencies.push(moduleName)
					// 改源码 替换。 修改value 值
					node.arguments = [t.stringLiteral(moduleName)]
				}
			}
		})
		// 代码还原
		let sourceCode = generator(ast).code
		return {
			sourceCode,dependencies
		}
	}
	
	// 构建模块
	buildModule(modulePath, isEntry) {
		// 拿到模块内容。  根据路径fs读取
		let source= this.getSource(modulePath)
		// 模块id  moduleName = modulePath - this.root  拿到 相对路径
		let moduleName = './' + path.relative(this.root, modulePath)
		
		if (isEntry) {
			this.entryId = moduleName // 如果是主入口 保存入口名字
		}
		
		// 解析 把source源码进行改造， 返回一个依赖列表
		let {sourceCode, dependencies} = this.parse(source, path.dirname(moduleName)) // 拿到当前文件的父路径

		this.modules[moduleName] = sourceCode
		
		dependencies.forEach(dep =>{
			// 绝对路径  附属模块递归引用
			this.buildModule(path.resolve(this.root, dep), false)
		})
	}
	
	emitFile() {
		// 用数据渲染模板
		// 拿到输出到那个目录
		let main = path.join(this.config.output.path, this.config.output.filename)
		
		// 模板路径
		let templatewStr = this.getSource(path.join(__dirname, 'main.ejs'))
		
		// 解析 模板 传参
		let code = require('ejs').render(templatewStr, {
			entryId: this.entryId, modules: this.modules
		})
		this.assets = {}
		this.assets[main] = code
		
		fs.writeFileSync(main, code)
	}
	
	run() {
		this.hooks.run.call()
		this.hooks.compile.call()
		// 执行 并且创建模块的依赖关系
		this.buildModule(path.resolve(this.root, this.entry), true) // 是主模块
		this.hooks.afterCompile.call()
		// console.log(this.modules, this.entryId)
		// 发射一个文件， 打包后的文件
		this.hooks.emit.call()
		this.emitFile()
		
		this.hooks.done.call()
	}
}

module.exports = Compiler