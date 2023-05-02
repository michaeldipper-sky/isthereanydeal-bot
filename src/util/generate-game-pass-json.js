const fs = require('fs');
const logger = require('winston');
const { fetchGamePassIds, fetchGamePassGames } = require('./fetch');

const generateGamePassJson = async () => {
  let games;

  try {
    const ids = (await fetchGamePassIds()).slice(1);
    games = (await fetchGamePassGames(ids.map((data) => data.id).join())).Products;
  } catch (e) {
    logger.error(`Unable to update Game Pass data due to exception (${e})`);
    return;
  }

  const gameTitles = games.map((data) => {
    const title = data.LocalizedProperties[0].ProductTitle;
    const boxArt = data.LocalizedProperties[0].Images.find((image) => image.ImagePurpose === 'BoxArt');
    const boxArtUri = boxArt ? `https:${boxArt.Uri}` : null;
    return { title, boxArtUri };
  });

  fs.writeFile('game-pass-games.json', JSON.stringify(gameTitles), 'utf8', (err) => {
    if (err) {
      logger.error(err);
    }
    logger.info('Successfully updated game pass data');
  });
};

module.exports = generateGamePassJson;
