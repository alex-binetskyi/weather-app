const path = require('path')
const express = require('express')
const hbs = require('hbs');
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast');
const icons = require('./utils/data/icons.json');
const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views');
const partialPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath);
hbs.registerPartials(partialPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'WeatherApp',
        name: 'Alex Binetskyi'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You have to provide an address.'
        })
    }

    geocode(req.query.address, (error, location) => {
		if(error) {
            return res.send({
                error: error
            })
        }
			
		forecast(location, (error, data) => {
            if(error) {
                return res.send({
                    error: error
                })		
            }

            data.forecast.current.weather[0].icon = icons[data.forecast.current.weather[0].icon];

            data.forecast.hourly.forEach(obj => {
                obj.weather[0].icon = icons[obj.weather[0].icon]
            });

            data.forecast.daily.forEach(obj => {
                obj.weather[0].icon = icons[obj.weather[0].icon]
            });

            res.send(data)
		})
	})
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})