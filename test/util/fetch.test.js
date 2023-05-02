const axios = require('axios');
const {
  buildItadURL, fetchItadPlain, itadFetch, fetchItadPrices, fetchItadSearchResult, fetchCdKeysPrice, fetchGamePassIds, fetchGamePassGames,
} = require('../../src/util/fetch');
const mockCdKeysResponse = require('./CdKeysResponse.json');
const mockGamePassGamesResponse = require('./GamePassGamesResponse.json');

jest.mock('axios');

const apiKey = process.env.ITAD_API_KEY || '';

test('buildItadUrl returns specified path', () => {
  const expectedUrl = `https://api.isthereanydeal.com/path&key=${apiKey}`;
  expect(buildItadURL('path')).toEqual(expectedUrl);
});

test('itadFetch calls ITAD API and returns data', () => {
  const mockResponse = {
    data: 'foo',
  };

  axios.get.mockResolvedValue(mockResponse);

  return itadFetch('path').then((data) => {
    expect(axios.get).toHaveBeenCalledWith(`https://api.isthereanydeal.com/path&key=${apiKey}`);
    expect(data).toEqual('foo');
  });
});

test('fetchItadPlain calls plain endpoint and returns the data objects', () => {
  const plain = 'astroneer';
  const mockResponse = {
    data: {
      '.meta': {
        match: 'title',
        active: true,
      },
      data: {
        plain,
      },
    },
    status: 200,
  };

  axios.get.mockResolvedValue(mockResponse);

  return fetchItadPlain('Astroneer').then((data) => {
    expect(axios.get).toHaveBeenCalledWith(`https://api.isthereanydeal.com/v02/game/plain/?title=Astroneer&key=${apiKey}`);
    expect(data).toEqual(mockResponse.data);
  });
});

test('fetchItadPrices calls overview endpoint and returns data object', () => {
  const mockResponse = {
    data: {
      '.meta': {
        region: 'uk',
        country: 'GB',
        currency: 'GBP',
      },
      data: {
        astroneer: {
          price: {
            store: 'Microsoft Store',
            cut: 0,
            price: 23.74,
            price_formatted: '£23.74',
            url: 'https://www.xbox.com/en-GB/games/store/p/9NBLGGH43KZB',
            drm: [],
          },
          lowest: {
            store: 'Chrono.gg',
            cut: 30,
            price: 10.46,
            price_formatted: '£10.46',
            url: null,
            recorded: 1528733172,
            recorded_formatted: '4 years ago',
          },
          bundles: {
            count: 0,
            live: [],
          },
          urls: {
            info: 'https://isthereanydeal.com/game/astroneer/info/',
            history: 'https://isthereanydeal.com/game/astroneer/history/',
            bundles: 'https://isthereanydeal.com/specials/#/filter:search/astroneer',
          },
        },
      },
    },
    status: 200,
  };

  axios.get.mockResolvedValue(mockResponse);

  return fetchItadPrices('astroneer').then((data) => {
    expect(axios.get).toHaveBeenCalledWith(`https://api.isthereanydeal.com/v01/game/overview/?region=uk&country=GB&plains=astroneer&key=${apiKey}`);
    expect(data).toEqual(mockResponse.data);
  });
});

test('fetchItadSearchResult calls search endpoint and returns data object', () => {
  const mockResponse = {
    data: {
      data: {
        results: [
          {
            id: 20314,
            plain: 'astroneer',
            title: 'ASTRONEER',
          },
        ],
        urls: {
          search: 'https://isthereanydeal.com/search/?q=Astroneer',
        },
      },
    },
    status: 200,
  };

  axios.get.mockResolvedValue(mockResponse);

  return fetchItadSearchResult('Astroneer').then((data) => {
    expect(axios.get).toHaveBeenCalledWith(`https://api.isthereanydeal.com/v02/search/search/?q=Astroneer&key=${apiKey}`);
    expect(data).toEqual(mockResponse.data);
  });
});

test('fetchCdKeysPrice sends post request to CDKeys search provider and returns data object', () => {
  const mockResponse = { data: mockCdKeysResponse, status: 200 };

  axios.post.mockResolvedValue(mockResponse);

  return fetchCdKeysPrice('Astroneer').then((data) => {
    expect(data).toEqual(mockResponse.data);
  });
});

test('fetchGamePassIds hits Game Pass API and returns data object', () => {
  const mockResponse = {
    data:
      [
        {
          siglId: 'fdd9e2a7-0fee-49f6-ad69-4354098401ff',
          title: 'All PC Games',
          description: 'Explore every game included with PC Game Pass',
          requiresShuffling: 'False',
          imageUrl: 'http://store-images.s-microsoft.com/image/global.47673.acentoprodimg.40520333-055e-420a-bd6e-39b85591ccd3.65c04579-754f-40be-a1f2-f0e983dba803',
        },
        {
          id: '9P0617LN3SF9',
        },
        {
          id: '9N97RC576957',
        },
      ],
    status: 200,
  };

  axios.get.mockResolvedValue(mockResponse);

  return fetchGamePassIds().then((data) => {
    expect(data).toEqual(mockResponse.data);
  });
});

test('fetchGamePassGames hits Microsoft API and returns data object', () => {
  const mockResponse = { data: mockGamePassGamesResponse, status: 200 };

  axios.get.mockResolvedValue(mockResponse);

  return fetchGamePassGames('9P0617LN3SF9').then((data) => {
    expect(data).toEqual(mockResponse.data);
  });
});
