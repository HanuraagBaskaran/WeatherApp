import React, { useState } from "react";

const Search = () => {
  const [city, setCity] = useState("");
  const [latestForecast, setLatestForecast] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  const fetchWeather = async (city) => {
    const apiKey = "70994374cdde6a0666ebcb73745c7283";
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&_=${Date.now()}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log("Weather Data Fetched:", data)
      setLatestForecast(data.list[0]);
      setForecast(data);
      const weeklyForecast = calculateWeeklyForecast(data.list);
      setForecastData(weeklyForecast);
    } catch (error) {
      console.error("Error fetching weather data:", error);
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

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSearch = () => {
    fetchWeather(city);
  };

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

  return (
    <div>
      <div className='container mt-5'>
      <nav className='navbar'>
        <a className='navbar-brand' href='/'>Weather</a>
        <ul className="navbar-nav mr-auto">
      <li className="nav-item ">
        <a className="nav-link" href="/">Home</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="search">Search</a>
      </li>
      </ul>
      </nav>
    </div>
    <div className={`container mt-5 ${weatherClass}`}>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={handleCityChange}
      />
      <button onClick={handleSearch}>Search</button>
      {forecast && (
  <div className="text-center custom-text">
    <h3>Date/Time: {forecast.list[0].dt_txt}</h3>
    <h3>Temperature: {Math.round(forecast.list[0].main.temp)}&deg;C</h3>
    <h3>Weather Conditions: {forecast.list[0].weather[0].description}</h3>
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

export default Search;
