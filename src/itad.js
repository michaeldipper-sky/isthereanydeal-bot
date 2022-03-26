const logger = require('winston');
const {
  fetchItadPlain,
  fetchItadPrices,
  fetchItadSearchResult,
} = require('./util/fetch');
const { buildEmbed } = require('./util/build-embed');
const { formatPriceData } = require('./util/format');

function getPriceData(game) {
  // hit the API to find the plain for the specified game
  const plainResponse = fetchItadPlain(game);

  return plainResponse
    .then((plainData) => {
      // if we get a response from the plain API and a match
      if (plainData && plainData['.meta'].match) {
        // hit the price endpoint
        const priceResponse = fetchItadPrices(plainData.data.plain);
        return priceResponse;
      }
      // else quit out
      return null;
    })
    .then((priceData) => {
      // if we get a response from the price API
      if (priceData) {
        const formattedPriceData = formatPriceData(game, priceData.data);
        return formattedPriceData;
      }
      // else quit out
      return null;
    })
    .catch((e) => {
      if (e.constructor === TypeError) {
        return 'PARSE_ERROR';
      }
      logger.error(e);
      return 'ITAD_ERROR';
    });
}

function searchForTitle(query) {
  const searchResponse = fetchItadSearchResult(query);

  return searchResponse
    .then((searchData) => searchData.data.list[0].title)
    .catch((e) => {
      logger.error(e);
      return 'SEARCH_ERROR';
    });
}

function isThereAnyDeal(cmd) {
  let searched = 0;
  return getPriceData(cmd)
    .then((gamePrice) => {
      if (gamePrice === 'PARSE_ERROR') {
        searched = 1;
        return searchForTitle(cmd);
      }
      if (gamePrice === 'ITAD_ERROR') {
        return "Couldn't get a response from ITAD :grimacing: Maybe try again later!";
      }

      const itadEmbed = buildEmbed(
        `${gamePrice.name}: ${gamePrice.currentPrice} at ${gamePrice.currentStore}`,
        'ITAD',
        gamePrice.currentURL,
        `Lowest historical price: ${gamePrice.lowestPrice} at ${gamePrice.lowestStore}`,
      );

      return itadEmbed;
    })
    .then((searchResultOrPriceMessage) => {
      if (searchResultOrPriceMessage === 'SEARCH_ERROR') {
        return 'Error parsing price data from ITAD. The game may not be for sale.';
      }
      if (searched) {
        return isThereAnyDeal(searchResultOrPriceMessage);
      }
      return searchResultOrPriceMessage;
    })
    .catch(() => `Couldn't find a match for ${cmd} on ITAD :disappointed:`);
}

module.exports = { isThereAnyDeal };
