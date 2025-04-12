import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1';

const CountryService = {
    // Get all countries
  getAllCountries: () => axios.get(`${BASE_URL}/all`),

  // Get countries by name
  getCountryByName: (name) => axios.get(`${BASE_URL}/name/${name}`),

  // Get countries by region
  getCountriesByRegion: (region) => axios.get(`${BASE_URL}/region/${region}`),

  // Get country by alpha code (e.g., 'US', 'LK', etc.)
  getCountryByCode: (code) => axios.get(`${BASE_URL}/alpha/${code}`),
};

export default CountryService;