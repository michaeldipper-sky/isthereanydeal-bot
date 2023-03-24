const logger = require('winston');
const {
  fetchItadPlain,
  fetchItadPrices,
  fetchItadSearchResult,
} = require('./util/fetch');
const { buildEmbed } = require('./util/build-embed');
const { formatPriceData } = require('./util/format');

const getPriceData = (game) => {
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
};

const searchForTitle = (query) => {
  const searchResponse = fetchItadSearchResult(query);

  return searchResponse
    .then((searchData) => searchData.data.list[0].title)
    .catch((e) => {
      logger.error(e);
      return 'SEARCH_ERROR';
    });
};

const isThereAnyDeal = async (game) => {
  try {
    const priceData = await getPriceData(game);

    if (priceData === 'PARSE_ERROR') {
      const title = await searchForTitle(game);

      if (title === 'SEARCH_ERROR') {
        return 'Error parsing price data from ITAD. The game may not be for sale.';
      }

      return isThereAnyDeal(title);
    }
    if (priceData === 'ITAD_ERROR') {
      return "Couldn't get a response from ITAD :grimacing: Maybe try again later!";
    }

    const itadEmbed = buildEmbed(
      `${priceData.name}: ${priceData.currentPrice} at ${priceData.currentStore}`,
      'ITAD',
      priceData.currentURL,
      `Lowest historical price: ${priceData.lowestPrice} at ${priceData.lowestStore}`,
    );

    return itadEmbed;
  } catch (e) {
    return `Couldn't find a match for ${game} on ITAD :disappointed:`;
  }
};

module.exports = { isThereAnyDeal };
