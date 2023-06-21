const logger = require('winston');
const fs = require('fs/promises');

const readWatchList = async () => {
  let watchList;

  try {
    const watchListString = await fs.readFile('watch-list.json', 'utf8');
    watchList = JSON.parse(watchListString);
    logger.info('Successfully read watch list');
  } catch (e) {
    logger.info(`Unable to parse watch list due to exception (${e}), creating new watch list...`);
    watchList = {};
  }

  return watchList;
};

const addGameToWatchList = async (user, plain) => {
  const watchList = await readWatchList();

  logger.info(`Adding ${plain} to watch list for ${user.tag}`);
  const userWatchList = watchList[user.id] || [];
  userWatchList.push(plain);

  watchList[user.id] = userWatchList;

  try {
    await fs.writeFile('watch-list.json', JSON.stringify(watchList), 'utf8');
    logger.info('Successfully updated watch list');
  } catch (e) {
    logger.error(`Unable to write watch list due to exception (${e})`);
  }
};

module.exports = { addGameToWatchList };
