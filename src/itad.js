const { fetchPlain, fetchPrices } = require('./fetch');

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

function isThereAnyDeal(game) {
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
  });
}

module.exports = isThereAnyDeal;
