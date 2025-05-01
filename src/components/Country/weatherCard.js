import React, { useEffect, useState } from "react";
import { getWeatherByCapital } from "../../services/weatherService";

const WeatherCard = ({ capital }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!capital) return;

    const fetchWeather = async () => {
      const data = await getWeatherByCapital(capital);
      setWeather(data);
    };

    fetchWeather();
  }, [capital]);

  if (!capital) return null;

  return weather ? (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mt-6 text-sm md:text-base">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
        <span className="text-yellow-500 mr-2">🌤️</span> Weather in {capital}
      </h2>

      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="Weather icon"
            className="w-16 h-16"
          />
        </div>

        <div className="flex-1">
          <p className="capitalize text-gray-700 dark:text-gray-300 font-medium mb-2">
            {weather.description}
          </p>

          <ul className="space-y-1 text-gray-600 dark:text-gray-400">
            <li>
              🌡️ <strong>{weather.temperature}°C</strong> <span className="text-sm text-gray-500">(Feels like {weather.feelsLike}°C)</span>
            </li>
            <li>
              💧 <strong>Humidity:</strong> {weather.humidity}%
            </li>
            <li>
              🍃 <strong>Wind Speed:</strong> {weather.windSpeed} m/s
            </li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="mt-4 text-gray-500 dark:text-gray-400">
      Fetching weather info...
    </div>
  );
};

export default WeatherCard;
