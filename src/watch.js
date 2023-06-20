const logger = require('winston');

const watchList = require('../watch-list.json');

const addGameToWatchList = (user, game) => {
  logger.info(`Adding ${game} to watch list for ${user.tag}`);
  watchList[user.id].push(game);

  logger.debug(`${user.id} is now watching: ${JSON.stringify(watchList[user.id])}`);
};

module.exports = { addGameToWatchList };
