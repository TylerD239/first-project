const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')

const app = express()

app.use(express.json({extended:true}))

//test
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/test', function(req, res, next) {


 const getWeather = async () => {

	const city = req.headers.city

	const geo_api = await fetch(`http://search.maps.sputnik.ru/search/addr?q=${city}`, {method: 'GET'})

	const geo = await geo_api.json()

	if (!geo.result.address) {
		res.send({'error':'no city'})
	} else {

 	const coords =  geo.result.address[0].features[0].geometry.geometries[0].coordinates
	const weather_api = await fetch(`https://api.weather.yandex.ru/v1/forecast?lat=${coords[1]}&lon=${coords[0]}`, 
	  	{method: 'GET',
    	headers: {
		'X-Yandex-API-Key': 'b32db626-2c9c-4c54-a244-6cbb107906b7'
    		}
        	 })

	  const weather = await weather_api.json()

	  res.send({weather, geo})
	}
 }



	getWeather()
});
//test

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))

if (process.env.NODE_ENV === 'production') {

	app.use('/', express.static(path.join(__dirname,'client', 'build')))

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

const PORT = config.get('port') || 5000;

async function start() {
	try {
		await mongoose.connect(config.get('mongoUri'), {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		});
		app.listen(PORT, ()=> console.log ("started..."))
	} catch (e) {
		console.log('server error', e.message)
		process.exit(1)
	}
}

start()
