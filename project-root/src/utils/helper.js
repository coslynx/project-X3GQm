const { YOUTUBE_API_KEY } = require('./constants');
const ytsr = require('ytsr');
const nodeFetch = require('node-fetch');
const moment = require('moment');

/**
 * Formats seconds into a time string (HH:MM:SS).
 *
 * @param {number} seconds The number of seconds to format.
 * @returns {string} The formatted time string.
 */
const formatTime = (seconds) => {
  return moment.duration(seconds, 'seconds').format('HH:mm:ss');
};

/**
 * Formats a track object into a user-friendly string.
 *
 * @param {Object} track The track object to format.
 * @returns {string} The formatted track string.
 */
const formatTrack = (track) => {
  return `${track.title} by ${track.artist}`;
};

/**
 * Checks if a URL is valid.
 *
 * @param {string} url The URL to validate.
 * @returns {boolean} True if the URL is valid, false otherwise.
 */
const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Checks if the provided input is valid for a specific purpose.
 *
 * @param {string} input The input to validate.
 * @param {string} type The type of input to validate (e.g., 'youtube', 'spotify', 'soundcloud').
 * @returns {boolean} True if the input is valid, false otherwise.
 */
const validateInput = (input, type) => {
  if (type === 'youtube') {
    return validateURL(input);
  } else if (type === 'spotify') {
    return input.match(/^[0-9a-zA-Z]{22}$/) !== null;
  } else if (type === 'soundcloud') {
    return validateURL(input);
  }
  return false;
};

/**
 * Fetches music data from a specified music service.
 *
 * @param {string} query The search query.
 * @param {string} service The music service to fetch data from (e.g., 'youtube', 'spotify', 'soundcloud').
 * @returns {Promise<Object>} A Promise that resolves with the fetched music data or rejects with an error.
 */
const fetchMusicData = async (query, service) => {
  if (service === 'youtube') {
    try {
      const results = await ytsr(query);
      const video = results.items[0];
      return {
        title: video.title,
        artist: video.author.name,
        url: video.url,
        thumbnail: video.bestThumbnail.url,
      };
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
      throw new Error('Failed to fetch YouTube data.');
    }
  } else if (service === 'spotify') {
    try {
      const response = await nodeFetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track`,
        {
          headers: {
            Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      const track = data.tracks.items[0];
      return {
        title: track.name,
        artist: track.artists[0].name,
        url: track.external_urls.spotify,
        thumbnail: track.album.images[0].url,
      };
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
      throw new Error('Failed to fetch Spotify data.');
    }
  } else if (service === 'soundcloud') {
    try {
      const response = await nodeFetch(
        `https://api.soundcloud.com/tracks?q=${encodeURIComponent(
          query
        )}&client_id=${process.env.SOUNDCLOUD_CLIENT_ID}`
      );
      const data = await response.json();
      const track = data[0];
      return {
        title: track.title,
        artist: track.user.username,
        url: track.permalink_url,
        thumbnail: track.artwork_url,
      };
    } catch (error) {
      console.error('Error fetching SoundCloud data:', error);
      throw new Error('Failed to fetch SoundCloud data.');
    }
  }
  return null;
};

module.exports = {
  formatTime,
  formatTrack,
  validateURL,
  validateInput,
  fetchMusicData,
};