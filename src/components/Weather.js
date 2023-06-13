import React, { useState, useEffect } from 'react';
import '../styles/Weather.css';

const Weather = () => {
  const [latestForecast, setLatestForecast] = useState(null);
  const [city, setCity] = useState('');

  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      const apiKey = '70994374cdde6a0666ebcb73745c7283';
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}&_=${Date.now()}`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log('Weather API data:', data);
        setLatestForecast(data.list[0]);
        setCity(data.city.name);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetchWeather(latitude, longitude);
          },
          (error) => {
            console.error('Error getting geolocation:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getLocation();
  }, []);

  return (
    
    <div className="container mt-5">
      <h2 className="text-center mb-4">Weather Forecast for {city}</h2>
      {latestForecast && (
        <div className="text-center custom-text">
          <h3>Date/Time: {latestForecast.dt_txt}</h3>
          <h3>Temperature: {Math.round(latestForecast.main.temp)}&deg;C</h3>
          <h3>Weather Conditions: {latestForecast.weather[0].description}</h3>
        </div>
      )}
    </div>
  );
};

export default Weather;
