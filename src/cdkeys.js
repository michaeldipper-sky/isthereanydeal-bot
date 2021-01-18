const logger = require('winston');
const { fetchCdkeysPrice } = require('./fetch');

function cdKeys(cmd) {
  return fetchCdkeysPrice(cmd).then((res) => {
    if (res.data.results[0].hits.length > 0) {
      const game = res.data.results[0].hits[0];
      return `${game.name}: ${game.price.GBP.default_formated}\n${game.url}`;
    }
    logger.debug(`Nothing found on CDKeys for ${cmd}`);
    return `Couldn't find a match for ${cmd} :disappointed:`;
  });
}

module.exports = { cdKeys };
