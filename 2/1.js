const parser = require('@babel/parser')
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default
const transformerWxml = require('@tarojs/transformer-wx').default

const code = `
	import JSX from './a.jsx'
	const a = 5
	let arr = [1,2,3]
	const titleView = <div>titletest</div>
	  let obj = {test: '132'}
	  
	function test_fn() {
		let a = 1
		return (
			<div>
				{[1,2,3].map(item => {
					return <li>{item}</li>
				})}
			</div>
		)
	}
`

const ast = parser.parse(code, {sourceType: 'module', plugins: ['jsx']})
//console.log(ast.program.body)
traverse(ast, {
	enter(path) {
		if (path.node?.id?.name == 'a') {
			path.node.id.name = 'b'
		}
	}
})
const output = generate(ast, {}, code)

console.log(output)

function buildComponent(code) {
	return `class Test {
			render() {
				return ${code}
			}
		}
	`
}

function jsx2wxml(jsxContent) {
	let res = transformerWxml({
		isRoot: false,
		isApp: false,
		sourcePath: __dirname,
		outputPath: __dirname,
		isTyped: false,
		code: buildComponent(jsxContent)
	})
	return res.template
}

let codeT = `(<div>{[1,2,3].map(item => {return <li key={item}>{item}</li>})}</div>)`
console.log(jsx2wxml(codeT))