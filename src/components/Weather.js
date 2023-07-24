import React, { useState, useEffect } from 'react';
import '../styles/Weather.css';
import Navbar from './Navbar.js'

const Weather = () => {
  const [latestForecast, setLatestForecast] = useState(null);
  const [city, setCity] = useState('');
  const [forecastData, setForecastData] = useState([]);

  const getDate = (dailyForecast) => {
    const date = dailyForecast.dt_txt.split(' ')[0];
    const dayDate = new Date(date);
    const day = dayDate.toLocaleDateString('en-US', { weekday: 'long' });  
    return day;
  };

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

      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }
    };

    const calculateWeeklyForecast=(forecastItem)=>{
      const dailyForecastMap= new Map();
      let dateCounter = 0;
      forecastItem.forEach(element => {
        const date=element.dt_txt.split(' ')[0];
        const dayDate = new Date(date);
        const day = dayDate.toLocaleDateString('en-US', { weekday: 'long' });
        const parts = date.split("-");
        const formattedDate = `${parts[2]}-${parts[1]}`

        if (dateCounter <=4) {
          dateCounter++;
          return; // Skip the first 4 dates
        }

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
        }else{
          dailyForecastMap.set(date,{
            formattedDate,
            day,
            maxTemp:element.main.temp_max,
            minTemp:element.main.temp_min,
            weatherConditions: [element.weather[0].main],
            weatherIcon: [element.weather[0].icon]
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
    <Navbar/>
    <div className={`container mt-5 ${weatherClass}`}>
      <h1 className="city">{city}</h1>
      {latestForecast && (
        <div className="text-center custom-text">
          <div className='d-flex flex-row justify-content-left'>
            <h1 className='align-self-center temperature'>{Math.round(latestForecast.main.temp)}&deg;C</h1>
            <span className='icon'>
            <img src={`https://openweathermap.org/img/wn/${latestForecast.weather[0].icon}@2x.png`} className='weather-icon' alt="Weather Icon"/>
            </span>
            </div>
            <div className='description'>
            <h3>{latestForecast.weather[0].description.charAt(0).toUpperCase() + latestForecast.weather[0].description.slice(1)}</h3>
            <h3>{getDate(latestForecast)}</h3>
            </div>
            <div className='d-flex flex-row text-start'>
              <h4><span className='fw-bold'>{Math.round(latestForecast.main.temp_max)}&deg;C</span> | <span className='fw-light'>{Math.round(latestForecast.main.temp_min)}&deg;C </span></h4>
            </div>
        </div>
      )}
      <div className='main-daily-forecast'>
      <h3>Daily Forecast</h3>
      <div className='daily-forecast'>
      {forecastData.map((dailyForecastArray)=>{
        return(
        <div key={dailyForecastArray.date} className='text-center multi-forecast'>
          <h3>{dailyForecastArray.day}</h3>
          <h3>{dailyForecastArray.formattedDate}</h3>
          <h3 ><span className='fw-bold'>{Math.round(dailyForecastArray.maxTemp)}&deg;C</span> | {Math.round(dailyForecastArray.minTemp)}&deg;C</h3>
          <h3></h3>
          <span className='icon-small'>
          <img src={`https://openweathermap.org/img/wn/${latestForecast.weather[0].icon}@2x.png`} alt="Weather Icon"/>
          </span>
          <h3>{dailyForecastArray.weatherConditions[0]}</h3>
        </div>
        );
      })}
      </div>
      </div>
    </div>
    </div>
  );
};

export default Weather;
