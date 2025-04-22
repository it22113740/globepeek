import axios from "axios";

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY; // Replace this with your real API key
const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

export const fetchVideoByCountry = async (countryName) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        part: "snippet",
        q: `Sceneric ${countryName}`,
        type: "video",
        maxResults: 1,
        key: API_KEY,
      },
    });

    const video = response.data.items[0];
    if (!video) return null;
    console.log(video);

    return {
      videoId: video.id.videoId,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.high.url,
      channelTitle: video.snippet.channelTitle,
    };
  } catch (error) {
    console.error("Error fetching YouTube video:", error);
    return null;
  }
};
