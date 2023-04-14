const logger = require('winston');
const {
  fetchItadPlain,
  fetchItadPrices,
  fetchItadSearchResult,
} = require('./util/fetch');
const { buildEmbed } = require('./util/build-embed');
const { formatPriceData } = require('./util/format');

const searchForPlain = async (query) => {
  const searchData = await fetchItadSearchResult(query);
  logger.debug(`searchData: ${JSON.stringify(searchData)}`);

  if (searchData.data.results.length === 0) {
    return 'NO_SEARCH_RESULTS';
  }

  return searchData.data.results[0].plain;
};

const getPlain = async (game) => {
  const plainData = await fetchItadPlain(game);
  logger.debug(`plainData: ${JSON.stringify(plainData)}`);

  if (!plainData || !plainData['.meta'].match) {
    logger.debug('No match found on plain route, trying search route...');
    return searchForPlain(game);
  }

  return plainData.data.plain;
};

const getPriceData = async (plain) => {
  const priceData = await fetchItadPrices(plain);
  logger.debug(`priceData: ${JSON.stringify(priceData)}`);

  const formattedPriceData = formatPriceData(plain, priceData.data);
  return formattedPriceData;
};

const isThereAnyDeal = async (game) => {
  try {
    const plain = await getPlain(game);

    if (plain === 'NO_SEARCH_RESULTS') {
      return `Couldn't find a match for ${game} on ITAD :disappointed:`;
    }

    const priceData = await getPriceData(plain);

    if (priceData === 'FORMATTING_ERROR') {
      return 'Error parsing price data from ITAD, you might need a "standard edition" or similar.';
    }

    const itadEmbed = buildEmbed(
      `${priceData.name}: ${priceData.currentPrice} at ${priceData.currentStore}`,
      'ITAD',
      priceData.currentURL,
      `Lowest historical price: ${priceData.lowestPrice} at ${priceData.lowestStore}`,
    );

    return itadEmbed;
  } catch (e) {
    logger.debug(e);
    return "Couldn't get a response from ITAD :grimacing: Maybe try again later!";
  }
};

module.exports = { isThereAnyDeal };
