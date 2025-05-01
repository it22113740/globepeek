import React, { useEffect, useState } from 'react';
import { getTopDestinations } from '../../services/placesService';
import { MapIcon } from '@heroicons/react/24/outline';
import { FaMapMarkerAlt } from 'react-icons/fa';

const TopDestinations = ({ country, lat, lon }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleDestinations, setVisibleDestinations] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchDestinations = async () => {
        try {
          const data = await getTopDestinations(lat, lon);
          const validData = data.filter(
            (d) => d?.properties?.name && typeof d.properties.name === 'string'
          );
          const uniqueDestinations = validData.filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.properties.name === value.properties.name)
          );
          setDestinations(uniqueDestinations);
          setVisibleDestinations(uniqueDestinations.slice(0, 6));
        } catch (err) {
          setError('Failed to fetch destinations');
        } finally {
          setLoading(false);
        }
      };

    fetchDestinations();
  }, [lat, lon]);

  const handleViewMore = () => {
    setShowMore(!showMore);
    setVisibleDestinations(showMore ? destinations.slice(0, 6) : destinations);
  };

  if (loading) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-300 mt-6">
        <div className="animate-spin inline-block w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mx-auto mt-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
        <FaMapMarkerAlt className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        Top Destinations in {country}
      </h2>
      {destinations.length > 0 ? (
        <ul className="space-y-3">
          {visibleDestinations.map((destination, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-indigo-600 dark:text-indigo-400">•</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {destination.properties.name}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          No top destinations found.
        </p>
      )}
      <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <MapIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        Explore more on the map
      </div>
      {destinations.length > 6 && (
        <button
          onClick={handleViewMore}
          className="mt-4 w-full py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-md hover:from-indigo-500 hover:to-violet-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label={showMore ? 'View fewer destinations' : 'View more destinations'}
        >
          {showMore ? 'View Less' : 'View More'}
        </button>
      )}
    </div>
  );
};

export default TopDestinations;