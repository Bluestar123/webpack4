let less = require('less')	
	
function loader(source) {
	console.log('less-loader333333333333333')
	let css
	less.render(source, function(err, r) {
		css = r.css
	})
	return css
}

module.exports = loader