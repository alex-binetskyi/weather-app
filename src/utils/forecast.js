const request = require('request');
const {appid, exclude} = require('./data/data');

const forecast = ({latitude, longitude, name}, callback) => {
	const urlExclude = exclude.join();

	const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=${urlExclude}&appid=${appid}&units=metric`;

	request({ url, json: true }, (error, {body}) => {
		if (error) {
			callback('Unable to connect to location services.', undefined)
		} else if (!body.current) {
			callback('Unable to find weather data for this location. Try another search.', undefined)
		} else {
			const forecast = body;
			forecast.location = name;
			callback(undefined, {
					forecast
				}
			)
		}
	})
}

module.exports = forecast