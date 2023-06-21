const logger = require('winston');
const fs = require('fs/promises');

const readWatchList = async () => {
  let watchList;

  try {
    const watchListString = await fs.readFile('watch-list.json', 'utf8');
    watchList = JSON.parse(watchListString);
    logger.info('Successfully read watch list');
  } catch (e) {
    logger.info(`Unable to parse watch list due to exception (${e}), using new watch list...`);
    watchList = {};
  }

  return watchList;
};

const writeWatchList = async (watchList) => {
  try {
    await fs.writeFile('watch-list.json', JSON.stringify(watchList), 'utf8');
    logger.info('Successfully updated watch list');
    return true;
  } catch (e) {
    logger.error(`Unable to write watch list due to exception (${e})`);
    return false;
  }
};

const addGameToWatchList = async (user, plain) => {
  const watchList = await readWatchList();

  const userWatchList = watchList[user.id] || [];
  if (!userWatchList.includes(plain)) {
    logger.info(`Adding ${plain} to watch list for ${user.tag}`);
    userWatchList.push(plain);
  }

  watchList[user.id] = userWatchList;

  return writeWatchList(watchList);
};

module.exports = { addGameToWatchList };
