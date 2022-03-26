const logger = require('winston');
const Fuse = require('fuse.js');
const { buildEmbed } = require('./util/build-embed');

function gamePass(query) {
  try {
    // eslint-disable-next-line
    const games = require('../game-pass-games.json');

    const options = {
      includeScore: true,
      keys: ['title'],
      threshold: 0,
      ignoreLocation: true,
    };

    const fuse = new Fuse(games, options);
    const result = fuse.search(query);

    if (result.length === 0) {
      return null;
    }

    const gameTitles = result.slice(0, 3).map((game) => `• ${game.item.title}`);
    return buildEmbed(null, 'PC Game Pass', null, gameTitles.join('\n'), result[0].item.boxArtUri);
  } catch (err) {
    logger.error(err);
    return null;
  }
}

module.exports = gamePass;
