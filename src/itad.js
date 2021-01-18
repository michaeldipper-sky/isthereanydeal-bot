const logger = require('winston');
const { fetchPlain, fetchPrices, fetchSearchResult } = require('./fetch');
const { formatPriceData, formatPriceMessage } = require('./util/format');

function getPriceData(game) {
  // hit the API to find the plain for the specified game
  const plainResponse = fetchPlain(game);

  return plainResponse.then((plainData) => {
    // if we get a response from the API and a match
    if (plainData && plainData['.meta'].match) {
      // hit the price endpoint
      const priceResponse = fetchPrices(plainData.data.plain);
      return priceResponse;
    }
    // else quit out
    return null;
  }).then((priceData) => {
    // if we get a response from the API
    if (priceData) {
      const formattedPriceData = formatPriceData(priceData.data);
      return formattedPriceData;
    }
    // else quit out
    return null;
  }).catch((e) => {
    if (e.constructor === TypeError) {
      return 'PARSE_ERROR';
    }
    return 'NO_ITAD';
  });
}

function searchForTitle(query) {
  const searchResponse = fetchSearchResult(query);

  return searchResponse.then((searchData) => searchData.data.list[0].title).catch(() => 'SEARCH_ERROR');
}

function isThereAnyDeal(cmd) {
  let searched = 0;
  return getPriceData(cmd)
    .then((gamePrice) => {
      if (gamePrice === 'PARSE_ERROR') {
        searched = 1;
        return searchForTitle(cmd);
      }
      if (gamePrice === 'NO_ITAD') {
        return "Couldn't connect to ITAD :grimacing: Please try again later!";
      }
      logger.info(`Got data for ${cmd}: ${gamePrice.name}`);
      return formatPriceMessage(cmd, gamePrice);
    })
    .then((searchResultOrPriceMessage) => {
      if (searchResultOrPriceMessage === 'SEARCH_ERROR') {
        return 'Error parsing price data. The game may not be for sale.';
      }
      if (searched) {
        return `Couldn't find that :thinking: Did you mean ${searchResultOrPriceMessage}?`;
      }
      return searchResultOrPriceMessage;
    })
    .catch(() => `Couldn't find a match for ${cmd} :disappointed:`);
}

module.exports = { isThereAnyDeal };
