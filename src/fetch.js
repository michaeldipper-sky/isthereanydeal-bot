const axios = require('axios');

const plainPath = 'v02/game/plain/?title=';
const pricePath = 'v01/game/overview/?region=uk&country=UK&plains=';
const searchPath = 'v01/search/search/?offset=0&limit=1&region=uk&country=UK&q=';

function buildURL(path) {
  const baseURL = process.env.ITAD_BASE_URL || 'https://api.isthereanydeal.com/';
  const APIKey = process.env.ITAD_API_KEY || '';
  const url = `${baseURL}${path}&key=${APIKey}`;
  return url;
}

function fetch(path) {
  return axios.get(buildURL(path)).then((resp) => resp.data);
}

function fetchPlain(title) {
  return fetch(plainPath + title);
}

function fetchPrices(plain) {
  return fetch(pricePath + plain);
}

function fetchSearchResult(title) {
  return fetch(searchPath + title);
}

module.exports = { fetchPlain, fetchPrices, fetchSearchResult };
