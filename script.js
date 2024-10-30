document.addEventListener('DOMContentLoaded', () => {
  const apiKey = 'bf0fcdc58aa3a11b517344d28b65ce1f';
  const cityInput = document.getElementById('cityInput');
  const searchButton = document.getElementById('searchButton');
  const loader = document.getElementById('loader');
  const weatherInfo = document.getElementById('weatherInfo');
  const geoMessage = document.getElementById('geoMessage');
  const errorMessage = document.createElement('p');

  errorMessage.id = 'errorMessage';
  document.querySelector('.search-section').appendChild(errorMessage);

  const debounce = (fn, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  };
  const searchEvent = debounce(() => {
    const city = cityInput.value.trim();
    if (city) {
      fetchWeatherData({ city });
    } else {
      displayError('Please enter a city name');
    }
  }, 300);

  searchButton.addEventListener('click', searchEvent);
  cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchEvent();
  });

  function getUserLocation() {
    if (navigator.geolocation) {
      loader.style.display = 'block';
      geoMessage.style.display = 'block';
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lon } = position.coords;
          fetchWeatherData({ lat, lon });
          geoMessage.style.display = 'none';
        },
        (error) => {
          displayError("Couldn't get your location. Please enter a city manually.");
        }
      );
    } else {
      displayError("Geolocation is not supported by your browser.");
    }
  }

  async function fetchWeatherData({ city, lat, lon }) {
    loader.style.display = 'block';
    weatherInfo.style.display = 'none';
    errorMessage.style.display = 'none';

    const url = city
      ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        displayWeatherData(data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      displayError(`Error: ${error.message}`);
    } finally {
      loader.style.display = 'none';
    }
  }

  function displayWeatherData(data) {
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

    const iconElement = document.querySelector('.weather-icon i');
    iconElement.className = `fas fa-${getWeatherIcon(data.weather[0].icon)}`;

    weatherInfo.style.display = 'block';
  }

  function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    loader.style.display = 'none';
    weatherInfo.style.display = 'none';
  }

  const iconMap = {
    '01d': 'sun', '01n': 'moon', '02d': 'cloud-sun', '02n': 'cloud-moon',
    '03d': 'cloud', '03n': 'cloud', '04d': 'cloud', '04n': 'cloud',
    '09d': 'cloud-showers-heavy', '09n': 'cloud-showers-heavy',
    '10d': 'cloud-sun-rain', '10n': 'cloud-moon-rain',
    '11d': 'bolt', '11n': 'bolt', '13d': 'snowflake', '13n': 'snowflake',
    '50d': 'smog', '50n': 'smog'
  };
  function getWeatherIcon(iconCode) {
    return iconMap[iconCode] || 'cloud';
  }

  getUserLocation();
});
