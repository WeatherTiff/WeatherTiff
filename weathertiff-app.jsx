import React, { useState, useEffect } from 'react';

export default function WeatherWiseApp() {
  const [locations, setLocations] = useState([
    { id: 1, name: 'Brooksville, FL', lat: 28.5655, lng: -82.4007, active: true }
  ]);
  const [activeLocation, setActiveLocation] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');

  const fetchWeatherData = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,weather_code&hourly=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto&temperature_unit=fahrenheit`
      );
      const data = await response.json();
      
      setWeather(data.current);
      setHourly(data.hourly);
      setForecast(data.daily);
      
      // Simulate severe weather alerts
      if (data.current.weather_code >= 80) {
        setAlerts([{ id: 1, type: 'storm', message: '⚠️ Severe Weather Alert: Thunderstorms in your area' }]);
      } else {
        setAlerts([]);
      }
    } catch (err) {
      console.error('Error fetching weather:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (locations.length > 0) {
      const loc = locations[activeLocation];
      fetchWeatherData(loc.lat, loc.lng);
    }
  }, [activeLocation, locations]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${searchInput}&count=1&language=en&format=json`
      );
      const geoData = await geoResponse.json();
      
      if (geoData.results && geoData.results.length > 0) {
        const { latitude, longitude, name, country } = geoData.results[0];
        const newLoc = {
          id: locations.length + 1,
          name: `${name}, ${country}`,
          lat: latitude,
          lng: longitude,
          active: false
        };
        setLocations([...locations, newLoc]);
        setSearchInput('');
      }
    } catch (err) {
      console.error('Error searching location:', err);
    }
  };

  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if (code === 1 || code === 2) return '⛅';
    if (code === 3) return '☁️';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 55) return '🌦️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌧️';
    if (code >= 85 && code <= 86) return '🌨️';
    if (code >= 95) return '⛈️';
    return '🌡️';
  };

  const getWeatherColor = (code) => {
    if (code === 0) return '#FFB81C';
    if (code <= 3) return '#87CEEB';
    if (code >= 45 && code <= 48) return '#A9A9A9';
    if (code >= 51 && code <= 82) return '#4169E1';
    if (code >= 85 && code <= 86) return '#87CEEB';
    if (code >= 95) return '#DC143C';
    return '#708090';
  };

  const currentLocation = locations[activeLocation];
  const currentHour = new Date().getHours();

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#1a1a1a'
    }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .container { max-width: 900px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .header h1 { color: white; font-size: 28px; font-weight: 600; }
        .theme-toggle { background: rgba(255,255,255,0.2); border: none; padding: 10px 16px; border-radius: 8px; color: white; cursor: pointer; font-size: 14px; backdrop-filter: blur(10px); }
        .search-card { background: white; border-radius: 16px; padding: 16px; margin-bottom: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .search-form { display: flex; gap: 10px; }
        .search-form input { flex: 1; padding: 12px 16px; border: 1px solid #e0e0e0; border-radius: 12px; font-size: 14px; }
        .search-form button { padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; }
        .alerts { margin-bottom: 20px; }
        .alert { background: #ff6b6b; color: white; padding: 12px 16px; border-radius: 12px; display: flex; align-items: center; gap: 12px; }
        .main-card { background: white; border-radius: 16px; padding: 24px; margin-bottom: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .current-weather { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: center; }
        .weather-icon-large { font-size: 80px; text-align: center; }
        .temp-display h2 { font-size: 56px; font-weight: 700; margin: 10px 0; }
        .condition { font-size: 18px; color: #666; margin: 8px 0; }
        .feeling { font-size: 14px; color: #999; }
        .location-tabs { display: flex; gap: 8px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 8px; }
        .location-tab { padding: 10px 16px; background: rgba(255,255,255,0.3); color: white; border: none; border-radius: 12px; cursor: pointer; white-space: nowrap; backdrop-filter: blur(10px); font-weight: 500; border: 2px solid transparent; }
        .location-tab.active { background: white; color: #667eea; border-color: white; }
        .details-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #f0f0f0; }
        .detail-item { text-align: center; }
        .detail-label { font-size: 12px; color: #999; text-transform: uppercase; margin-bottom: 4px; }
        .detail-value { font-size: 18px; font-weight: 600; color: #1a1a1a; }
        .forecast-card { background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .forecast-title { font-size: 16px; font-weight: 600; margin-bottom: 16px; }
        .hourly-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 10px; }
        .hour-card { flex-shrink: 0; background: #f8f9fa; border-radius: 12px; padding: 16px; text-align: center; min-width: 90px; border: 1px solid #e0e0e0; }
        .hour-time { font-size: 12px; color: #666; margin-bottom: 8px; font-weight: 600; }
        .hour-icon { font-size: 28px; margin: 8px 0; }
        .hour-temp { font-size: 14px; font-weight: 600; color: #1a1a1a; }
        .daily-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; }
        .day-card { background: #f8f9fa; border-radius: 12px; padding: 16px; text-align: center; border: 1px solid #e0e0e0; }
        .day-name { font-size: 12px; color: #666; font-weight: 600; margin-bottom: 8px; }
        .day-icon { font-size: 32px; margin: 8px 0; }
        .day-temps { font-size: 13px; color: #1a1a1a; }
        .day-high { font-weight: 600; }
        .day-low { color: #999; }
      `}</style>

      <div className="container">
        <div className="header">
          <h1>WeatherTiff</h1>
          <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        <div className="search-card">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search locations..."
            />
            <button type="submit">Add</button>
          </form>
        </div>

        <div className="location-tabs">
          {locations.map((loc, idx) => (
            <button
              key={loc.id}
              className={`location-tab ${activeLocation === idx ? 'active' : ''}`}
              onClick={() => setActiveLocation(idx)}
            >
              {loc.name}
            </button>
          ))}
        </div>

        {alerts.length > 0 && (
          <div className="alerts">
            {alerts.map(alert => (
              <div key={alert.id} className="alert">
                {alert.message}
              </div>
            ))}
          </div>
        )}

        {weather && !loading && (
          <>
            <div className="main-card">
              <div className="current-weather">
                <div className="weather-icon-large">
                  {getWeatherIcon(weather.weather_code)}
                </div>
                <div className="temp-display">
                  <h2>{Math.round(weather.temperature_2m)}°F</h2>
                  <p className="condition">{weather.weather_code === 0 ? 'Clear Sky' : weather.weather_code <= 3 ? 'Partly Cloudy' : 'Rainy'}</p>
                  <p className="feeling">Feels like {Math.round(weather.apparent_temperature)}°F</p>
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-label">💨 Wind</div>
                  <div className="detail-value">{Math.round(weather.wind_speed_10m)} mph</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">💧 Humidity</div>
                  <div className="detail-value">{weather.relative_humidity_2m}%</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">🔽 Pressure</div>
                  <div className="detail-value">{Math.round(weather.pressure_msl)} mb</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">🧭 Direction</div>
                  <div className="detail-value">{Math.round(weather.wind_direction_10m)}°</div>
                </div>
              </div>
            </div>

            {hourly && (
              <div className="forecast-card">
                <div className="forecast-title">Hourly Forecast</div>
                <div className="hourly-scroll">
                  {hourly.time.slice(currentHour, currentHour + 12).map((time, idx) => (
                    <div key={time} className="hour-card">
                      <div className="hour-time">{new Date(time).getHours()}:00</div>
                      <div className="hour-icon">{getWeatherIcon(hourly.weather_code[currentHour + idx])}</div>
                      <div className="hour-temp">{Math.round(hourly.temperature_2m[currentHour + idx])}°</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {forecast && (
              <div className="forecast-card">
                <div className="forecast-title">7-Day Forecast</div>
                <div className="daily-grid">
                  {forecast.time.slice(0, 7).map((date, idx) => (
                    <div key={date} className="day-card">
                      <div className="day-name">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="day-icon">{getWeatherIcon(forecast.weather_code[idx])}</div>
                      <div className="day-temps">
                        <div className="day-high">{Math.round(forecast.temperature_2m_max[idx])}°</div>
                        <div className="day-low">{Math.round(forecast.temperature_2m_min[idx])}°</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {loading && (
          <div className="main-card" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading weather data...
          </div>
        )}
      </div>
    </div>
  );
}