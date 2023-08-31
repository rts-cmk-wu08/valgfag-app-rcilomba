import React, { useState, useEffect } from 'react';
import OneSignal from 'react-onesignal';
import PWAPrompt from 'react-ios-pwa-prompt';

const api = {
  key: "61ae3c88e444a235897bb4086e509977",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {

  useEffect(() => {
    OneSignal.init({appId: process.env.REACT_APP_ONESIGNAL });
  }, []);
  
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [showLocationBox, setShowLocationBox] = useState(false);

  const search = evt => {
    if (evt.key === "Enter") {
      if (!query) {
        setErrorMessage('Please enter a City!');
        setShowLocationBox(false);
      } else {
        fetch(`${api.base}weather?q=${query}&appid=${api.key}&units=metric`)
          .then(res => res.json())
          .then(result => {
            setWeather(result);
            setQuery('');
            setErrorMessage('');
            setShowLocationBox(true);
            console.log(result)
          });
      }
    }
  }

  const dateBuilder = (d) => {
    let months = ["January", "February", "Mars", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }

  let classNameApp = 'app';

  if (typeof weather.main !== "undefined") {
    if (weather.main.temp > 28) {
      classNameApp = 'app hot';
    } else if (weather.main.temp > 16) {
      classNameApp = 'app warm';
    }
  }

  return (
    <>
    <div className={classNameApp}>
      <main>
        <div className="search-box">
          <input type="text"
            className="search-bar"
            placeholder="Enter a City..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {errorMessage && (
          <div className="error-message">{errorMessage}</div>
        )}
        {showLocationBox && typeof weather.main !== "undefined" ? (
          <div>
            <div className="location-box">
              <div className="location">{weather.name}, {weather.sys.country}</div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">
                {Math.round(weather.main.temp)}°c
              </div>
              <div className="weather">{weather.weather[0].main}</div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
    <PWAPrompt copyTitle="Add to homescreen!" />
    </>
  );
}

export default App;


