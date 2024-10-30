document.addEventListener('DOMContentLoaded', () => {
  const apiKey = 'bf0fcdc58aa3a11b517344d28b65ce1f';
  const cityInput = document.getElementById('cityInput');
  const searchButton = document.getElementById('searchButton');
  const loader = document.getElementById('loader');
  const weatherInfo = document.getElementById('weatherInfo');

  function searchEvent() {
    const city = cityInput.value.trim();
    if (city) {
      fetchWeatherData(city);
    } else {
      alert('Please enter a city name');
    }
  }
  searchButton.addEventListener('click', searchEvent);
  cityInput.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
      searchEvent();
    }

  });

  function getUserLocation() {
    const geoMessage = document.getElementById('geoMessage');
    if (navigator.geolocation) {
      loader.style.display = 'block';
      geoMessage.style.display = 'block';
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeatherDataByCoords(lat, lon);
          geoMessage.style.display = 'none';
        },
        (error) => {
          console.error("Error getting user location:", error);
          loader.style.display = 'none';
          geoMessage.style.display = 'none';
          alert("Couldn't get your location. Please enter a city manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser. Please enter a city manually.");
    }
  }

  async function fetchWeatherDataByCoords(lat, lon) {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
      const data = await response.json();

      if (response.ok) {
        displayWeatherData(data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      loader.style.display = 'none';
    }
  }

  async function fetchWeatherData(city) {
    loader.style.display = 'block';
    weatherInfo.style.display = 'none';

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
      const data = await response.json();

      if (response.ok) {
        displayWeatherData(data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
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

  function getWeatherIcon(iconCode) {
    const iconMap = {
      '01d': 'sun',
      '01n': 'moon',
      '02d': 'cloud-sun',
      '02n': 'cloud-moon',
      '03d': 'cloud',
      '03n': 'cloud',
      '04d': 'cloud',
      '04n': 'cloud',
      '09d': 'cloud-showers-heavy',
      '09n': 'cloud-showers-heavy',
      '10d': 'cloud-sun-rain',
      '10n': 'cloud-moon-rain',
      '11d': 'bolt',
      '11n': 'bolt',
      '13d': 'snowflake',
      '13n': 'snowflake',
      '50d': 'smog',
      '50n': 'smog'
    };

    return iconMap[iconCode] || 'cloud';
  }

  // Call getUserLocation when the page loads
  getUserLocation();
});