import { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Card, Row, Spinner } from 'react-bootstrap';

function App() {
  const [cities, setCities] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    fetchCitiesOptions();
  }, []);


  const fetchCitiesOptions = () => {
    fetch(`${import.meta.env.VITE_WEATHER_URL}/locations/v1/topcities/150?apikey=${import.meta.env.VITE_API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
      })
      .catch((err) => {
        console.error("Failed to fetch cities:", err);
      });
  };

  const fetchCurrentWeather = (locationKey) => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_WEATHER_URL}/currentconditions/v1/${locationKey}?apikey=${import.meta.env.VITE_API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setCurrentWeather(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch weather:", err);
        setLoading(false);
      });
  };

  const handleLocationChange = (event) => {
    const locationKey = event.target.value;
    setSelectedCity(locationKey);
    if (locationKey) {
      fetchCurrentWeather(locationKey);
    } else {
      setCurrentWeather(null);
    }
  };

  return (
    <Container>
      <h1 className="text-center mb-4 pt-5">🌤 Weather App</h1>
      <Card className="p-4 shadow">
        <label htmlFor="city" className="mb-2">Choose a city:</label>
        <select
          className="form-select mb-4"
          id="city"
          onChange={handleLocationChange}
          value={selectedCity}
        >
          <option value="">-- Select a city --</option>
          {cities.map((city) => (
            <option key={city.Key} value={city.Key}>
              {city.LocalizedName}, {city.Country.LocalizedName}
            </option>
          ))}
        </select>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className='fs-3'>Loading weather...</p>
          </div>
        )}

        {!loading && currentWeather && (
          <div className="weather-box text-center">
            <Row className="align-items-center">
              <Col md={4}>
                <img
                  src={`https://developer.accuweather.com/sites/default/files/${String(currentWeather.WeatherIcon).padStart(2, '0')}-s.png`}
                  alt="Weather Icon"
                />
              </Col>
              <Col md={8}>
                <h4>{currentWeather.WeatherText}</h4>
                <p>
                  🌡 {currentWeather.Temperature.Metric.Value}°
                  {currentWeather.Temperature.Metric.Unit} /{" "}
                  {currentWeather.Temperature.Imperial.Value}°
                  {currentWeather.Temperature.Imperial.Unit}
                </p>
              </Col>
            </Row>
          </div>
        )}

        {!loading && selectedCity && !currentWeather && (
          <p className="text-danger text-center">Failed to fetch weather data.</p>
        )}
      </Card>
    </Container>
  );
}

export default App;
