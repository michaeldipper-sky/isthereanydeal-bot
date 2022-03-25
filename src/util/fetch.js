const axios = require('axios');

const plainPath = 'v02/game/plain/?title=';
const pricePath = 'v01/game/overview/?region=uk&country=GB&plains=';
const searchPath = 'v01/search/search/?offset=0&limit=1&region=uk&country=UK&q=';

function buildItadURL(path) {
  const apiKey = process.env.ITAD_API_KEY || '';
  const url = `https://api.isthereanydeal.com/${path}&key=${apiKey}`;
  return url;
}

function itadFetch(path) {
  return axios.get(buildItadURL(path)).then((resp) => resp.data);
}

function fetchItadPlain(title) {
  return itadFetch(plainPath + escape(title));
}

function fetchItadPrices(plain) {
  return itadFetch(pricePath + escape(plain));
}

function fetchItadSearchResult(title) {
  return itadFetch(searchPath + escape(title));
}

function fetchCdkeysPrice(title) {
  return axios.post(
    'https://muvyib7tey-dsn.algolia.net/1/indexes/*/queries',
    {
      requests: [
        {
          indexName: 'magento2_default_products',
          params: `query=${escape(title)}`,
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
  );
}

function fetchGamePassIds() {
  return axios
    .get(
      'https://catalog.gamepass.com/sigls/v2?id=fdd9e2a7-0fee-49f6-ad69-4354098401ff&language=en-gb&market=GB',
    )
    .then((resp) => resp.data);
}

function fetchGamePassGames(ids) {
  return axios
    .get(
      `https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=${ids}&market=GB&languages=en-gb&MS-CV=DGU1mcuYo0WMMp+F.1`,
    )
    .then((resp) => resp.data);
}

module.exports = {
  fetchItadPlain,
  fetchItadPrices,
  fetchItadSearchResult,
  fetchCdkeysPrice,
  fetchGamePassIds,
  fetchGamePassGames,
};
