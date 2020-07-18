#! /usr/bin/env node

// 1. 找到当前执行命令的路径， 拿到 webpack.config.js

let path = require('path')

// config配置文件
let config = require(path.resolve('webpack.config.js'))

// 解析 
let Compiler = require('../lib/Compiler.js')
let compiler = new Compiler(config)
compiler.hooks.entryOptions.call() // tap 是监听， call 去执行
// 标识运行编译
compiler.run()