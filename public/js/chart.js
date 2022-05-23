function renderChart(data) {
  const forecast = data.hourly.slice(0, 24);

  const chartData = {
    labels: [],
    datasets: [{
      data: [],
      fill: 'start',
      borderColor: 'rgb(92, 165, 241)',
      backgroundColor: 'rgba(92, 165, 241, 0.1)',
      tension: 0.1,
      own: {
        humidity: [],
        description: [],
        wind_speed: []
      }
    }],

  };

  forecast.forEach(hour => {
    const time = new Date((hour.dt + Number(new Date().getTimezoneOffset())*60 + data.timezone_offset) * 1000)
    chartData.labels.push(timeFormat(time.getHours()) + ':' + timeFormat(time.getMinutes()));
    chartData.datasets[0].data.push(Math.round(hour.temp));
    chartData.datasets[0].own.humidity.push(hour.humidity);
    chartData.datasets[0].own.description.push(hour.weather[0].description);
    chartData.datasets[0].own.wind_speed.push(hour.wind_speed);
  })

  const ctx = document.getElementById('forecast-24h').getContext('2d');
  Chart.defaults.font.family = "'Montserrat', 'Arial', sans-serif";
  Chart.defaults.font.size = 11;

  new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      layout: {
        padding: {
          top: 16
        }
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: Math.round,
          color: '#2D2D2D',
        },
        tooltip: {
          displayColors: false,
          titleFont: {
            weight: 500
          },
          bodyFont: {
            size: 0
          },
          footerFont: {
            weight: 500
          },
          callbacks: {
            labelColor: function(context) {
              return {
                backgroundColor: 'rgba(92, 165, 241, 0.1)',
              };
            },
            title: function(context) {
              return `time: ${context[0].label}\ntemp: ${context[0].raw}°\nhmd: ${context[0].dataset.own.humidity[context[0].dataIndex]}%\nwind: ${context[0].dataset.own.wind_speed[context[0].dataIndex]} m/s`
            },
            footer: function(context){
              return context[0].dataset.own.description[context[0].dataIndex];
            }
          },
          backgroundColor: '#74b5f3'
        }
      },
      pointBackgroundColor: 'rgb(92, 165, 241)',
      scales: {
          y: {
            display: false,
            beginAtZero: true,
            grid: {
              display: false,
            },
          },
          x: {
            grid: {
              display: false,
            }
          }
      },
    },
    plugins: [ChartDataLabels]
  });
}

