const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const getWeatherByCapital = async (capitalCity) => {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(capitalCity)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Weather data not found.");
    }

    const data = await response.json();
    return {
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      feelsLike: data.main.feels_like,
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};
