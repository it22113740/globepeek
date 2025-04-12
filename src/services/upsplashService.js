import axios from "axios";

const ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

export const fetchCountryImages = async (countryName, count) => {
  const response = await axios.get(
    `https://api.unsplash.com/search/photos`,
    {
      params: {
        query: countryName,
        per_page: count,
      },
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
      },
    }
  );

  return response.data.results;
};

