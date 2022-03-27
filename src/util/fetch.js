const axios = require('axios');
const logger = require('winston');

const plainPath = 'v02/game/plain/?title=';
const pricePath = 'v01/game/overview/?region=uk&country=GB&plains=';
const searchPath = 'v01/search/search/?offset=0&limit=1&region=uk&country=UK&q=';

function buildItadURL(path) {
  const apiKey = process.env.ITAD_API_KEY || '';
  const url = `https://api.isthereanydeal.com/${path}&key=${apiKey}`;
  return url;
}

function itadFetch(path) {
  const url = buildItadURL(path);
  logger.debug(`Fetching from ${url}`);
  return axios
    .get(url)
    .then((resp) => {
      logger.debug(`Fetched from ${url} with status code ${resp.status}`);
      return resp.data;
    });
}

function fetchItadPlain(title) {
  return itadFetch(plainPath + encodeURIComponent(title));
}

function fetchItadPrices(plain) {
  return itadFetch(pricePath + encodeURIComponent(plain));
}

function fetchItadSearchResult(title) {
  return itadFetch(searchPath + encodeURIComponent(title));
}

function fetchCdkeysPrice(title) {
  logger.debug('Fetching from CDKeys');
  return axios
    .post(
      'https://muvyib7tey-dsn.algolia.net/1/indexes/*/queries',
      {
        requests: [
          {
            indexName: 'magento2_default_products',
            params: `query=${encodeURIComponent(title)}`,
            facetFilters: [
              [
                'platforms:Steam',
                'platforms:GOG.com',
                'platforms:Origin',
                'platforms:uPlay',
                'platforms:Epic Games Launcher',
                'platforms:Developer Website',
              ],
            ],
          },
        ],
      },
      {
        params: {
          'x-algolia-application-id': 'MUVYIB7TEY',
          'x-algolia-api-key':
            'ODNjY2VjZjExZGE2NTg3ZDkyMGQ4MjljYzYwM2U0NmRjYWI4MDgwNTQ0NjgzNmE2ZGQyY2ZmMDlkMzAyYTI4NXRhZ0ZpbHRlcnM9',
        },
      },
    )
    .then((resp) => {
      logger.debug(`Fetched from CDKeys with status code ${resp.status}`);
      return resp;
    });
}

function fetchGamePassIds() {
  const gamePassIdsUrl = 'https://catalog.gamepass.com/sigls/v2?id=fdd9e2a7-0fee-49f6-ad69-4354098401ff&language=en-gb&market=GB';
  logger.debug(`Fetching from ${gamePassIdsUrl}`);
  return axios
    .get(gamePassIdsUrl)
    .then((resp) => {
      logger.debug(
        `Fetched from ${gamePassIdsUrl} with status code ${resp.status}`,
      );
      return resp.data;
    })
    .catch((e) => {
      logger.error(e);
    });
}

function fetchGamePassGames(ids) {
  const gamePassGamesUrl = `https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=${ids}&market=GB&languages=en-gb&MS-CV=DGU1mcuYo0WMMp+F.1`;
  logger.debug('Fetching games from displaycatalog.mp.microsoft.com');
  return axios
    .get(gamePassGamesUrl)
    .then((resp) => {
      logger.debug(
        `Fetched from displaycatalog.mp.microsoft.com with status code ${resp.status}`,
      );
      return resp.data;
    })
    .catch((e) => {
      logger.error(e);
    });
}

module.exports = {
  fetchItadPlain,
  fetchItadPrices,
  fetchItadSearchResult,
  fetchCdkeysPrice,
  fetchGamePassIds,
  fetchGamePassGames,
};
