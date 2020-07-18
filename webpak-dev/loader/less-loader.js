let less = require('less')
function loader(source) { // source是源码
	// console.log('---------111111111---------', source)
	let css = ''
	
	less.render(source, function(err, c) {
		css = c.css
	})
	// css = css.replace(/\n/g, '\\n')
	return css
}

module.exports = loader