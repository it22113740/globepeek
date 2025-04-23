import React from 'react';
import {
  UsersIcon,
  GlobeAltIcon,
  BuildingLibraryIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const CountryCard = ({ country }) => {
  let navigate = useNavigate();
  return (
    <div className="flip-card w-full h-80 rounded-2xl overflow-hidden shadow-xl">
      <div className="flip-inner relative w-full h-full rounded-2xl bg-white dark:bg-gray-800">
        {/* Front Side */}
        <div className="flip-front flex flex-col items-center justify-center p-4">
          <img
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
            className="h-32 object-contain"
          />
          <h2 className="text-xl font-bold mt-2 text-center text-gray-800 dark:text-white">
            {country.name.common}
          </h2>
        </div>

        {/* Back Side */}
        <div className="flip-back flex flex-col justify-center p-4 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 gap-6">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 cursor-pointer items-end justify-end pr-6" onClick={() => navigate(`/${country.name.common}`)}>
            <ArrowRightIcon className="w-7 h-7 text-blue-600" />
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <UsersIcon className="w-5 h-5 text-indigo-600" />
            <span className="text-xl font-medium">
              Population: {country.population.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <GlobeAltIcon className="w-5 h-5 text-green-600" />
            <span className="text-xl font-medium">
              Continent: {country.continents?.[0]}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <BuildingLibraryIcon className="w-5 h-5 text-red-600" />
            <span className="text-xl font-medium flex items-center gap-2">
              Capital: {country.capital?.[0] || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryCard;
