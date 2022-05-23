const request = require('request');
const {appid} = require('./data/data');

const geocode = (address, callback) => {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${address}&limit=1&appid=${appid}`;

  request({ url, json: true }, (error, res) => {
    if (error) {
      callback('Unable to connect to location services.', undefined)
    } else if (!res.body.length || res.body.cod == 400) {
      callback('Unable to find location. Try another search.', undefined)
    } else {
      callback(undefined, {
        latitude: res.body[0].lat,
        longitude: res.body[0].lon,
        name: `${res.body[0].name}, ${res.body[0].country}`
      })
    }
  })
}

module.exports = geocode