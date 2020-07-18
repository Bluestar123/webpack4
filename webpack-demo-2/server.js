const Express = require('express')

let app = new Express()

app.get('/', async (res) => {
	res.send('aaaaaaaaaaaa')
})

app.listen(3000, ()=>{
	console.log('启动了')
})