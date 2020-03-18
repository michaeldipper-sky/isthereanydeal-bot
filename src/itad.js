const { fetchPlain, fetchPrices } = require('./fetch');
const { formatPriceData } = require('./util/format');

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
  }).catch((e) => {
    if (e.constructor === TypeError) {
      return 'PARSE_ERROR';
    }
    return 'NO_ITAD';
  });
}

module.exports = isThereAnyDeal;
