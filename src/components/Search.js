import React, { useState } from "react";

const Search = () => {
  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState(null);

  const fetchWeather = async (city) => {
    const apiKey = "70994374cdde6a0666ebcb73745c7283";
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&_=${Date.now()}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log("Weather Data Fetched:", data)
      setForecast(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSearch = () => {
    fetchWeather(city);
  };

  return (
    <div className="container mt-5">
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
    </div>
  );
};

export default Search;
