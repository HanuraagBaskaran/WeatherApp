import React, { useState, useEffect } from 'react';
import '../styles/Weather.css';

const Weather = () => {
  const [latestForecast, setLatestForecast] = useState(null);
  const [city, setCity] = useState('');
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      const cachedData=sessionStorage.getItem('weatherData');
    if(cachedData){
      const parsedData=JSON.parse(cachedData);
      setLatestForecast(parsedData.latestForecast);
      setCity(parsedData.city);
      setForecastData(parsedData.forecastData);
      console.log("cached data")
    }
    else{
      const apiKey = '70994374cdde6a0666ebcb73745c7283';
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}&_=${Date.now()}`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setLatestForecast(data.list[0]);
        setCity(data.city.name);
        const weeklyForecast = calculateWeeklyForecast(data.list);
        setForecastData(weeklyForecast);

        const cachedData=JSON.stringify({
          latestForecast:data.list[0],
          city:data.city.name,
          forecastData:weeklyForecast
        });
        sessionStorage.setItem('weatherData', cachedData);
        console.log(sessionStorage.getItem("weatherData"))

      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }
    };

    const calculateWeeklyForecast=(forecastItem)=>{
      const dailyForecastMap= new Map();
      forecastItem.forEach(element => {
        const date=element.dt_txt.split(' ')[0];

        if (dailyForecastMap.has(date)){
          const existingForecast=dailyForecastMap.get(date);
          existingForecast.maxTemp=Math.max(
            existingForecast.maxTemp,
            element.main.temp_max
          );
          existingForecast.minTemp=Math.min(
            existingForecast.minTemp,
            element.main.temp_min
          );
          existingForecast.weatherConditions.push(element.weather[0].description)
        }else{
          dailyForecastMap.set(date,{
            date,
            maxTemp:element.main.temp_max,
            minTemp:element.main.temp_min,
            weatherConditions: [element.weather[0].description],
          });
        }
      });

      const dailyForecastArray = Array.from(dailyForecastMap.values());
      setForecastData(dailyForecastArray);
      return dailyForecastArray;
    }

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
  },);

  let weatherClass='default-weather'

  if (latestForecast){
    const weatherCondition=latestForecast.weather[0].main.toLowerCase()
    if (weatherCondition === 'thunderstorm') {
      weatherClass = 'weather-thunderstorm';
    } else if (weatherCondition === 'drizzle') {
      weatherClass = 'weather-drizzle';
    } else if (weatherCondition === 'rain') {
      weatherClass = 'weather-rain';
    } else if (weatherCondition === 'snow') {
      weatherClass = 'weather-snow';
    } else if (weatherCondition === 'mist') {
      weatherClass = 'weather-mist';
    } else if (weatherCondition === 'smoke') {
      weatherClass = 'weather-smoke';
    } else if (weatherCondition === 'haze') {
      weatherClass = 'weather-haze';
    } else if (weatherCondition === 'dust') {
      weatherClass = 'weather-dust';
    } else if (weatherCondition === 'fog') {
      weatherClass = 'weather-fog';
    } else if (weatherCondition === 'sand') {
      weatherClass = 'weather-sand';
    } else if (weatherCondition === 'ash') {
      weatherClass = 'weather-ash';
    } else if (weatherCondition === 'squall') {
      weatherClass = 'weather-squall';
    } else if (weatherCondition === 'tornado') {
      weatherClass = 'weather-tornado';
    } else if (weatherCondition === 'clear') {
      weatherClass = 'weather-clear';
    } else if (weatherCondition === 'clouds') {
      weatherClass = 'weather-clouds';
    }
  }


  return(
    <div>
    <div className='container mt-5'>
      <nav className='navbar'>
        <a className='navbar-brand' href='#'>Weather</a>
        <ul class="navbar-nav mr-auto">
      <li class="nav-item ">
        <a class="nav-link" href="#">Home</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/search">Search</a>
      </li>
      </ul>
      </nav>
    </div>
    <div className={`container mt-5 ${weatherClass}`}>
      <h2 className="text-center mb-4">Weather Forecast for {city}</h2>
      {latestForecast && (
        <div className="text-center custom-text">
          <h3>Date/Time: {latestForecast.dt_txt}</h3>
          <h3>Temperature: {Math.round(latestForecast.main.temp)}&deg;C</h3>
          <img src={`https://openweathermap.org/img/wn/${latestForecast.weather[0].icon}@2x.png`} alt="Weather Icon"/>
          <h3>Weather Conditions: {latestForecast.weather[0].description}</h3>
        </div>
      )}

      {forecastData.map((dailyForecastArray)=>{
        return(
        <div key={dailyForecastArray.date} className='text-center custom-text'>
          <h3>Date:{dailyForecastArray.date}</h3>
          <h3>Max Temperature: {Math.round(dailyForecastArray.maxTemp)}&deg;C</h3>
          <h3>Min Temperature: {Math.round(dailyForecastArray.minTemp)}&deg;C</h3>
        </div>
        );
      })}
    </div>
    </div>
  );
};

export default Weather;
