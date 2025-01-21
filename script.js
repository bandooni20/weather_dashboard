// OpenWeatherMap API Key
const apiKey = '9f7d1a7e3d404515110801f0e937987d';

// Selecting DOM elements
const cityInput = document.getElementById('cityInput'); // Input field for city name (HTML: <input>)
const searchButton = document.getElementById('searchButton'); // Search button (HTML: <button>)
const currentWeather = document.getElementById('currentWeather'); // Current weather display container (CSS: styled card-like box)
const forecastContainer = document.getElementById('forecast'); // Forecast container (CSS: grid layout)
const currentLocationButton = document.getElementById('currentLocationButton'); // "Use My Location" button (HTML: <button>)

// Event listener for search button
searchButton.addEventListener('click', () => {
  const city = cityInput.value.trim(); // Get input from text field (HTML: <input>)
  if (city) fetchWeatherData(city); // Fetch weather data if city name is provided
});

// Event listener for "Use My Location" button
currentLocationButton.addEventListener('click', () => {
  // Check if Geolocation is supported
  if (navigator.geolocation) {
    // Get user's current latitude and longitude
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords; // Geolocation API provides lat/lon
        fetchWeatherByLocation(latitude, longitude); // Fetch weather using lat/lon
      },
      (error) => {
        alert('Unable to retrieve your location. Please check your location settings.');
      }
    );
  } else {
    alert('Geolocation is not supported by your browser.');
  }
});

// Function to fetch current weather data by city name
async function fetchWeatherData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    ); // Fetch data from OpenWeatherMap API
    if (!response.ok) throw new Error('City not found'); // Error handling for invalid city
    const data = await response.json(); // Parse JSON response
    updateCurrentWeather(data); // Update UI with current weather data
    fetchForecastData(city); // Fetch 5-day forecast
  } catch (error) {
    alert(error.message); // Show error message in alert
  }
}

// Function to fetch weather using latitude and longitude (Geolocation)
async function fetchWeatherByLocation(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    ); // Fetch data using coordinates
    if (!response.ok) throw new Error('Unable to fetch weather for your location.');
    const data = await response.json(); // Parse JSON response
    updateCurrentWeather(data); // Update the current weather section (CSS: flexbox layout)

    // Fetch forecast using latitude and longitude
    fetchForecastByLocation(lat, lon);
  } catch (error) {
    alert(error.message); // Error handling
  }
}

// Function to fetch 5-day weather forecast using lat/lon
async function fetchForecastByLocation(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    ); // Fetch data from API
    if (!response.ok) throw new Error('Unable to fetch forecast for your location.');
    const data = await response.json(); // Parse JSON response
    updateForecast(data.list); // Update forecast UI (HTML: dynamic cards for daily forecast)
  } catch (error) {
    alert(error.message); // Error handling
  }
}

// Function to update the current weather UI
function updateCurrentWeather(data) {
  // Update city name (HTML: <h2>)
  document.getElementById('cityName').textContent = data.name;

  // Display current date (CSS: small font size for date)
  document.getElementById('date').textContent = new Date().toLocaleDateString();

  // Display temperature (HTML: <p>, CSS: larger font size for emphasis)
  document.getElementById('temp').textContent = `Temp: ${data.main.temp}°C`;

  // Display wind speed and humidity (HTML: <p>, styled in a card layout)
  document.getElementById('wind').textContent = `Wind: ${data.wind.speed} m/s`;
  document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;

  // Update weather icon (HTML: <i>, Font Awesome icons based on weather)
  const iconCode = data.weather[0].icon; // API provides an icon code
  document.getElementById('weatherIcon').className = `fas ${getIconClass(iconCode)} text-5xl`;
}

// Function to fetch forecast data for a city
async function fetchForecastData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    ); // Fetch forecast data
    if (!response.ok) throw new Error('Forecast not found');
    const data = await response.json(); // Parse JSON
    updateForecast(data.list); // Update UI with forecast cards
  } catch (error) {
    alert(error.message); // Error handling
  }
}

// Function to update the 5-day weather forecast UI
function updateForecast(forecast) {
    forecastContainer.innerHTML = ''; // Clear existing forecast cards
  
    // Iterate through forecast data (8 data points/day)
    for (let i = 0; i < forecast.length; i += 8) {
      const day = forecast[i];
  
      // Create a card for each day's forecast
      const card = document.createElement('div');
      card.className = 'card'; // Add the card class dynamically
  
      card.innerHTML = `
        <p class="font-bold text-lg">${new Date(day.dt * 1000).toLocaleDateString()}</p>
        <i class="fas ${getIconClass(day.weather[0].icon)} text-4xl my-3"></i>
        <p class="font-semibold">Temp: ${day.main.temp}°C</p>
        <p>Wind: ${day.wind.speed} m/s</p>
        <p>Humidity: ${day.main.humidity}%</p>
      `;
      forecastContainer.appendChild(card); // Add card to the container
    }
  }
  

// Function to map OpenWeatherMap icon codes to Font Awesome classes
function getIconClass(iconCode) {
  if (iconCode.startsWith('01')) return 'fa-sun text-yellow-500'; // Clear sky
  if (iconCode.startsWith('02')) return 'fa-cloud-sun text-yellow-300'; // Few clouds
  if (iconCode.startsWith('03') || iconCode.startsWith('04')) return 'fa-cloud text-gray-500'; // Scattered/broken clouds
  if (iconCode.startsWith('09') || iconCode.startsWith('10')) return 'fa-cloud-showers-heavy text-blue-500'; // Rain
  if (iconCode.startsWith('11')) return 'fa-bolt text-yellow-400'; // Thunderstorm
  if (iconCode.startsWith('13')) return 'fa-snowflake text-blue-300'; // Snow
  if (iconCode.startsWith('50')) return 'fa-smog text-gray-400'; // Mist
  return 'fa-question-circle text-red-500'; // Default for unknown codes
}

function updateCurrentWeather(data) {
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('date').textContent = new Date().toLocaleDateString();
    document.getElementById('temp').textContent = `Temp: ${data.main.temp}°C`;
    document.getElementById('wind').textContent = `Wind: ${data.wind.speed} m/s`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
  
    //  isplay feels-like temperature
    const feelsLike = document.createElement('p');
    feelsLike.textContent = `Feels Like: ${data.main.feels_like}°C`;
    feelsLike.className = 'feels-like';
    currentWeather.appendChild(feelsLike);
  
    // NEW: Display weather description
    const weatherDescription = document.createElement('p');
    weatherDescription.textContent = `Condition: ${data.weather[0].description}`;
    weatherDescription.className = 'weather-description';
    currentWeather.appendChild(weatherDescription);
  }
  

