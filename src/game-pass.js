const logger = require('winston');
const Fuse = require('fuse.js');

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

    return result.map((game) => `${game.item.title} :white_check_mark:`);
  } catch (err) {
    logger.error(err);
    return null;
  }
}

module.exports = gamePass;
