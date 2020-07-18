console.log('hello 你好aaaaaaaaaa')
const test = require('./test.js')
const File = require('./file.js')

require('./index.css')
console.log(test)

const fn = () => console.log('我是箭头函数')

fn()

class A{
	a = 1
}

function *test1() {
	yield 1
}

console.log(test1().next())