module.exports = {
	a: 1
}
require('@babel/polyfill')
console.log('aa'.includes('a'))

// jquery 以$形式 暴露给 全局变量
// import $ from 'jquery'

console.log($)