import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [outfit, setOutfit] = useState([]);

  const apiKey = 'a42fb09a25b443bf4d6c139a1cc29a07'; // Hardcoded for now

  // Enhanced AI-like weather suggestion
  const getWeatherSuggestion = (weatherData) => {
    const temp = weatherData.main.temp;
    const condition = weatherData.weather[0].description.toLowerCase();
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    const currentTime = Date.now() / 1000; // Current time in seconds
    const sunset = weatherData.sys.sunset;
    const sunrise = weatherData.sys.sunrise;

    let tips = [];

    // Condition-based tips
    if (condition.includes('rain')) {
      tips.push('It’s going to rain—stay dry and watch for puddles!');
    } else if (condition.includes('clear') || condition.includes('sun')) {
      tips.push('Sunny day ahead—perfect for outdoor plans!');
    } else if (condition.includes('cloud')) {
      tips.push('It’s cloudy—could be a cool, overcast day.');
    } else if (condition.includes('snow')) {
      tips.push('Snowy weather—stay warm and tread carefully!');
    }

    // Temperature-based tips
    if (temp < 5) tips.push('Freezing out there—layer up!');
    else if (temp < 15) tips.push('Chilly weather—bring a jacket!');
    else if (temp > 30) tips.push('Hot day—stay hydrated and cool!');

    // Humidity-based tips
    if (humidity > 80) tips.push('High humidity—opt for breathable fabrics!');
    else if (humidity < 30) tips.push('Dry air—consider moisturizer!');

    // Wind-based tips
    if (windSpeed > 10) tips.push('Windy conditions—secure loose items!');
    else if (windSpeed > 5) tips.push('Breezy out there—hold onto your hat!');

    // Time-of-day tips
    if (currentTime > sunset) tips.push('Cool evening ahead—bring an extra layer!');
    else if (currentTime < sunrise) tips.push('Cold morning—warm up before heading out!');

    return tips.length > 0 ? tips.join(' ') : 'Pleasant weather—enjoy your day!';
  };

  // Enhanced AI Clothing Outfit Generator
  const getOutfitSuggestion = (weatherData) => {
    const temp = weatherData.main.temp;
    const condition = weatherData.weather[0].description.toLowerCase();
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;

    if (condition.includes('rain')) {
      return [
        { item: 'Raincoat', image: process.env.PUBLIC_URL + '/image/raincoat.jfif' },
        { item: 'Umbrella', image: process.env.PUBLIC_URL + '/image/Umbrella.jfif' },
        { item: 'Waterproof Boots', image: process.env.PUBLIC_URL + '/image/Waterproofboots.jfif' },
        { item: 'Quick-Dry Pants', image: process.env.PUBLIC_URL + '/image/Quick-Dry Pants.jfif' },
        ...(windSpeed > 10 ? [{ item: 'Hooded Scarf', image: process.env.PUBLIC_URL + '/image/Hoodedscarf.jfif' }] : []),
      ];
    } else if (condition.includes('clear') || condition.includes('sun')) {
      return [
        { item: 'T-shirt', image: process.env.PUBLIC_URL + '/image/tshirt.jfif' },
        { item: 'Sunglasses', image: process.env.PUBLIC_URL + '/image/Sunglasses.jfif' },
        { item: 'Shorts', image: process.env.PUBLIC_URL + '/image/Shorts.jfif' },
        { item: 'Sandals', image: process.env.PUBLIC_URL + '/image/Sandals.jfif' },
        ...(temp > 35 ? [{ item: 'Sun Hat', image: process.env.PUBLIC_URL + '/image/sunhat.jfif' }] : []),
      ];
    } else if (condition.includes('cloud')) {
      return [
        { item: 'Long Sleeve Shirt', image: process.env.PUBLIC_URL + '/image/longsleeve.jfif' },
        { item: 'Jeans', image: process.env.PUBLIC_URL + '/image/jeans.jfif' },
        { item: 'Sneakers', image: process.env.PUBLIC_URL + '/image/Sneakers.jfif' },
        { item: 'Light Jacket', image: process.env.PUBLIC_URL + '/image/lightJacket.jfif' },
        ...(humidity > 80 ? [{ item: 'Breathable Socks', image: process.env.PUBLIC_URL + '/image/bSocks.jfif' }] : []),
      ];
    } else if (condition.includes('snow')) {
      return [
        { item: 'Winter Coat', image: process.env.PUBLIC_URL + '/image/WinterCoat.jfif' },
        { item: 'Scarf', image: process.env.PUBLIC_URL + '/image/Scarf.jfif' },
        { item: 'Gloves', image: process.env.PUBLIC_URL + '/image/Gloves.jfif' },
        { item: 'Thermal Pants', image: process.env.PUBLIC_URL + '/image/ThermalPants.jfif' },
        { item: 'Snow Boots', image: process.env.PUBLIC_URL + '/image/SnowBoots.jfif' },
      ];
    } else if (temp < 10) {
      return [
        { item: 'Sweater', image: process.env.PUBLIC_URL + '/image/Sweater.jfif' },
        { item: 'Jeans', image: process.env.PUBLIC_URL + '/image/jeans.jfif' },
        { item: 'Boots', image: process.env.PUBLIC_URL + '/image/Boots.jfif' },
        { item: 'Warm Hat', image: process.env.PUBLIC_URL + '/image/Warmhat.jfif' },
        ...(windSpeed > 5 ? [{ item: 'Windbreaker', image: process.env.PUBLIC_URL + '/image/Windbreaker.jfif' }] : []),
      ];
    } else if (temp > 30) {
      return [
        { item: 'Tank Top', image: process.env.PUBLIC_URL + '/image/TankTop.jfif' },
        { item: 'Shorts', image: process.env.PUBLIC_URL + '/image/Shorts.jfif' },
        { item: 'Flip Flops', image: process.env.PUBLIC_URL + '/image/Flip Flops.jfif' },
        { item: 'Cap', image: process.env.PUBLIC_URL + '/image/Cap.jfif' },
        ...(humidity > 80 ? [{ item: 'Light Scarf', image: process.env.PUBLIC_URL + '/image/LightScarf.jfif' }] : []),
      ];
    } else {
      return [
        { item: 'T-shirt', image: process.env.PUBLIC_URL + '/image/tshirt.jfif' },
        { item: 'Jeans', image: process.env.PUBLIC_URL + '/image/jeans.jfif' },
        { item: 'Sneakers', image: process.env.PUBLIC_URL + '/image/Sneakers.jfif' },
        { item: 'Light Cardigan', image: process.env.PUBLIC_URL + '/image/LightCardigan.jfif' },
        ...(windSpeed > 5 ? [{ item: 'Scarf', iimage: process.env.PUBLIC_URL + '/image/LightScarf.jfif' }] : []),
      ];
    }
  };

  const fetchWeather = async () => {
    setLoading(true);
    setError('');
    setWeather(null);
    setSuggestion('');
    setOutfit([]);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      setSuggestion(getWeatherSuggestion(response.data));
      setOutfit(getOutfitSuggestion(response.data));
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Location not found. Please try again.');
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
      setLocation('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) fetchWeather();
  };

  return (
    <div className="App">
      <h1>WeatherBit AI Outfit Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city name"
          className="input-field"
        />
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Loading...' : 'Get Weather & Outfit'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Fetching weather...</p>}

      {weather && (
        <div className="weather-info">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="weather-icon"
          />
          <p className="description">{weather.weather[0].description}</p>
          <p>Temperature: <span>{weather.main.temp}°C</span></p>
          <p>Feels Like: <span>{weather.main.feels_like}°C</span></p>
          <p>Humidity: <span>{weather.main.humidity}%</span></p>
          <p>Wind Speed: <span>{weather.wind.speed} m/s</span></p>

          {suggestion && (
            <div className="suggestion">
              <h3>AI Weather Tips:</h3>
              <p>{suggestion}</p>
            </div>
          )}

          {outfit.length > 0 && (
            <div className="outfit-section">
              <h3>AI Outfit Suggestion:</h3>
              <div className="outfit-cards">
                {outfit.map((item, index) => (
                  <div key={index} className="outfit-card">
                    <img src={item.image} alt={item.item} className="outfit-image" />
                    <p>{item.item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;