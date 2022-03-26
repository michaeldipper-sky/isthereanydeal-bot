const fs = require('fs');
const logger = require('winston');
const { fetchGamePassIds, fetchGamePassGames } = require('./fetch');

const generateGamePassJson = async () => {
  const ids = (await fetchGamePassIds()).slice(1);
  const games = (await fetchGamePassGames(ids.map((data) => data.id).join())).Products;

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
