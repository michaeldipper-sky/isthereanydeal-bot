const titleCaseRegex = /\w\S*/g;

function formatPriceMessage(name, gamePrice) {
  return `${name.replace(
    titleCaseRegex,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  )}: ${gamePrice.currentPrice} at ${gamePrice.currentStore}\n${
    gamePrice.currentURL
  }\nLowest historical price: ${gamePrice.lowestPrice} at ${
    gamePrice.lowestStore
  }`;
}

function formatPriceData(priceData) {
  // take the response from the price endpoint and grab the desired stuff
  const priceEntries = Object.entries(priceData);
  const gameOne = priceEntries[0];

  const formatted = {
    name: gameOne[0],
    lowestPrice: `${gameOne[1].lowest.price_formatted}`.replace('&pound;', '£'),
    lowestStore: gameOne[1].lowest.store,
    currentPrice: `${gameOne[1].price.price_formatted}`.replace('&pound;', '£'),
    currentStore: gameOne[1].price.store,
    currentURL: gameOne[1].price.url,
  };

  return formatted;
}

module.exports = { formatPriceMessage, formatPriceData };
