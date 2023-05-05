const { fetchCdKeysPrice } = require('./util/fetch');
const { buildEmbed } = require('./util/build-embed');

function cdKeys(cmd) {
  return fetchCdKeysPrice(cmd).then((data) => {
    if (data.results[0].hits.length > 0) {
      const game = data.results[0].hits[0];

      const cdKeysEmbed = buildEmbed(
        `${game.name}: ${game.price.GBP.default_formated}`,
        'CDKeys',
        game.url,
        `Platform(s): ${game.platforms}`,
        game.image_url,
      );

      return cdKeysEmbed;
    }
    return `Couldn't find a match for ${cmd} on CDKeys :disappointed:`;
  });
}

module.exports = cdKeys;
