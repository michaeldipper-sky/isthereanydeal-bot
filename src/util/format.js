const logger = require('winston');

const titleCaseRegex = /\w\S*/g;

function formatPriceData(name, priceData) {
  try {
    // take the response from the price endpoint and grab the desired stuff
    const priceEntries = Object.entries(priceData);
    const gameOne = priceEntries[0];

    const formatted = {
      name: name.replace(
        titleCaseRegex,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
      ),
      lowestPrice: `${gameOne[1].lowest.price_formatted}`.replace('&pound;', '£'),
      lowestStore: gameOne[1].lowest.store,
      currentPrice: `${gameOne[1].price.price_formatted}`.replace('&pound;', '£'),
      currentStore: gameOne[1].price.store,
      currentURL: gameOne[1].price.url,
    };

    return formatted;
  } catch (e) {
    logger.debug(e);
    return 'FORMATTING_ERROR';
  }
}

module.exports = { formatPriceData };
