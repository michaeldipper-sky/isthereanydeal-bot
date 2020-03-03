const axios = require('axios');

const plainPath = 'v02/game/plain/?title=';
// to-do: populate store fronts from storefronts.json
const pricePath = 'v01/game/overview/?region=uk&country=UK&shop=steam,humblestore&plains=';

function buildURL(path) {
  const baseURL = 'https://api.isthereanydeal.com/';
  const APIKey = '3829171ce89f084f86464626db190900276d658d';
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

module.exports = { fetchPlain, fetchPrices };
