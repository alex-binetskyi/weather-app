const form = document.querySelector('#weather-search');
const search = form.querySelector('input');
forecastContainer = document.querySelector('.forecast');

let messageOutput = document.createElement('p');
messageOutput.classList.add('message');
messageOutput.textContent = 'Enter the name of the location.'
forecastContainer.before(messageOutput);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  forecastContainer.classList.remove('forecast--rendered');

  if(!document.querySelector('.message')) {
    messageOutput = document.createElement('p');
    messageOutput.classList.add('message');
    messageOutput.textContent = '';
    forecastContainer.before(messageOutput);
  }

  if(forecastContainer.children.length) {
    Array.from(forecastContainer.children).forEach(child => child.remove());
  }

  if(!search.value) {
    messageOutput.textContent = 'You have to provide an address.';
    return
  }

  if(!search.value.match(/^[a-z0-9_.,'"!?;:& ]+$/i)){
    messageOutput.textContent = 'Name of the location should be in English.';
    return
  }

  messageOutput.textContent = 'Loading...';
  forecastContainer.append(messageOutput);

  fetch(`http://localhost:3000/weather?address=${search.value}`).then((response) => {
    response.json().then((data) => {
      if(data.error) {
        messageOutput.textContent = data.error;
      } else {
        forecastContainer.classList.add('forecast--rendered');
        messageOutput.remove();
        renderTemplates(data);
      }
    })
  })
})