let forecastContainer = document.querySelector('.forecast');

function renderAlert(data) {
  if(!data.hasOwnProperty('alerts')) {
    return
  }

  data.alerts.forEach(function(item, index) {
    data.alerts.forEach(function(verifiableItem, verifiableIndex) {
      if(index !== verifiableIndex &&
        item.tags[0] === verifiableItem.tags[0] && 
        item.start === verifiableItem.start &&
        item.end === verifiableItem.end) {
          if(item.hasOwnProperty('description') && item.description.length) {
            data.alerts.splice(verifiableIndex, 1);
          } else if(verifiableItem.hasOwnProperty('description') && verifiableItem.description.length) {
            data.alerts.splice(index, 1);
          } else {
            data.alerts.splice(verifiableIndex, 1);
          }
      }
    });
  });

  let alerts = [];
  data.alerts.forEach(alert => {
    const startTime = new Date((alert.start + Number(new Date().getTimezoneOffset())*60 + data.timezone_offset) * 1000);
    const endTime = new Date((alert.end + Number(new Date().getTimezoneOffset())*60 + data.timezone_offset) * 1000);

    const alertTemplate = `
      <div class="alert">
        <h2>
          ${alert.event}
        </h2>
        <p class="alert__time">
          <time datetime="${startTime.getFullYear()}-${timeFormat(startTime.getMonth() + 1)}-${timeFormat(startTime.getDate())} ${startTime.getHours()}:${timeFormat(startTime.getMinutes())}">
            ${startTime.getFullYear()}.${timeFormat(startTime.getMonth() + 1)}.${timeFormat(startTime.getDate())} ${startTime.getHours()}:${timeFormat(startTime.getMinutes())}
          </time>
          -
          <time datetime="${endTime.getFullYear()}-${timeFormat(endTime.getMonth() + 1)}-${timeFormat(endTime.getDate())} ${endTime.getHours()}:${timeFormat(endTime.getMinutes())}">
            ${endTime.getFullYear()}.${timeFormat(endTime.getMonth() + 1)}.${timeFormat(endTime.getDate())} ${endTime.getHours()}:${timeFormat(endTime.getMinutes())}
          </time>
        </p>
        <p>
          ${alert.description}
        </p>
      </div>
    `;
    alerts.push(alertTemplate);
  })
  alerts = alerts.join('');

  const section = document.createElement('section');
  section.classList.add('alerts');
  section.innerHTML = `
  ${alerts}
  `;
  forecastContainer.append(section);
}

function renderNowTemplate(data) {
  const time = new Date((data.current.dt + Number(new Date().getTimezoneOffset())*60 + data.timezone_offset) * 1000);
  
  const forecastNow =  `
  <h2 class="visually-hidden">Forecast for current moment</h2>
  <div class="gap">
    <div class="forecast-now__block forecast-now__block-main">
      <div class="forecast__row">
        <img src="/img/${data.current.weather[0].icon}.svg" width="64" height="64" alt=${data.current.weather[0].description}>
        <p class="forecast-now__weather"><b>${Math.round(data.current.temp)}°C</b><br> ${data.current.weather[0].description}</p>
      </div>
      <div class="forecast__column">
        <p class="forecast-now__location">
          <span>${data.location}</span>
          <time datetime="${time.getFullYear()}-${timeFormat(time.getMonth() + 1)}-${timeFormat(time.getDate())} ${time.getHours()}:${timeFormat(time.getMinutes())}" class="forecast-now__time">
            ${new Intl.DateTimeFormat('en-US', { weekday: 'short'}).format(time)}, ${time.getHours()}:${timeFormat(time.getMinutes())}
          </time>
        </p>
      </div>
    </div>
  </div>
  <div class="gap">
    <div class="forecast-now__block forecast-now__block-secondary">
      <table>
        <tbody>
          <tr>
            <th>
              Feels like
            </th>
            <td>
            ${Math.round(data.current.feels_like)}°C
            </td>
          </tr>
          <tr>
            <th>
              Humidity
            </th>
            <td>
            ${Math.round(data.current.humidity)}%
            </td>
          </tr>
          <tr>
            <th>
              Pressure
            </th>
            <td>
            ${data.current.pressure} hpa
            </td>
          </tr>
          <tr>
            <th>
              Wind speed
            </th>
            <td>
            ${data.current.wind_speed} m/s
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `;
  const section = document.createElement('section');
  section.classList.add('forecast-now');
  section.innerHTML = forecastNow;
  forecastContainer.append(section);
}

function rendeChartTemplate(data, callback) {
  const section = document.createElement('section');
  section.classList.add('forecast-chart');
  section.innerHTML = `
  <h2 class="visually-hidden">Forecast chart for next 24 hours</h2>
  <div class="forecast-chart__inner">
    <canvas id="forecast-24h" width="928" height="174"></canvas>
  </div>
  `;
  forecastContainer.append(section);
  callback(data);
}

function renderWeekTemplate(data) {
  let days = [];
  data.daily.forEach(day => {
    const time = new Date((day.dt + Number(new Date().getTimezoneOffset())*60 + data.timezone_offset) * 1000);

    const dayTemplate = `
    <div class="forecast-week__day">
      <h3>
        <time datetime="${time.getFullYear()}-${timeFormat(time.getMonth() + 1)}-${timeFormat(time.getDate())}">
          ${new Intl.DateTimeFormat('en-US', { weekday: 'short'}).format(time)}</h3>
        </time>
      <div class="forecast-week__day-img">
        <img src="/img/${day.weather[0].icon}.svg" width="64" height="64" alt=${day.weather[0].description}>
      </div>
      <p class="forecast-week__day-temp"><span>${Math.round(day.temp.max)}°</span><span>${Math.round(day.temp.min)}°</span></p>
    </div>
    `;
    days.push(dayTemplate);
  });
  
  days = days.join('');

  const section = document.createElement('section');
  section.classList.add('forecast-week');
  section.innerHTML = `
  <h2 class="visually-hidden">Forecast chart for whole week</h2>
  ${days}
  `;
  forecastContainer.append(section);
}

function renderTemplates({forecast}) {
  renderAlert(forecast);
  renderNowTemplate(forecast);
  rendeChartTemplate(forecast, renderChart);
  renderWeekTemplate(forecast);
}