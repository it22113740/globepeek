import axios from 'axios';

const API_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY;  // Access the API key from the .env file
const BASE_URL = 'https://api.geoapify.com/v2/places?categories=tourism&lat={lat}&lon={lon}&apiKey=';

export const getTopDestinations = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL.replace("{lat}", lat).replace("{lon}", lon)}${API_KEY}`);
    return response.data.features;
  } catch (error) {
    throw new Error('Failed to fetch destinations');
  }
};