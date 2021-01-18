const axios = require('axios');

const plainPath = 'v02/game/plain/?title=';
const pricePath = 'v01/game/overview/?region=uk&country=UK&plains=';
const searchPath = 'v01/search/search/?offset=0&limit=1&region=uk&country=UK&q=';

function buildItadURL(path) {
  const baseURL = process.env.ITAD_BASE_URL || 'https://api.isthereanydeal.com/';
  const APIKey = process.env.ITAD_API_KEY || '';
  const url = `${baseURL}${path}&key=${APIKey}`;
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

module.exports = {
  fetchItadPlain, fetchItadPrices, fetchItadSearchResult, fetchCdkeysPrice,
};
