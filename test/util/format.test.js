const { formatPriceData } = require('../../src/util/format');

test('formatPriceData returns correctly formatted price data', () => {
  const expected = {
    currentPrice: '$17.49',
    currentStore: 'Steam',
    currentURL: 'https://store.steampowered.com/app/460930/',
    lowestPrice: '$17.49',
    lowestStore: 'Steam',
    name: 'Game Name',
  };

  const formattedPriceData = formatPriceData('Game name', {
    'app/460930': {
      price: {
        store: 'Steam',
        cut: 65,
        price: 17.49,
        price_formatted: '$17.49',
        url: 'https://store.steampowered.com/app/460930/',
        drm: [
          'Denuvo Anti-tamper',
          'steam',
          'Other DRM',
          'uplay',
        ],
      },
      lowest: {
        store: 'Steam',
        cut: 65,
        price: 17.49,
        price_formatted: '$17.49',
        url: 'https://store.steampowered.com/app/460930/',
        recorded: 1544469391,
        recorded_formatted: '18 days ago',
      },
      bundles: {
        count: 0,
        live: [],
      },
      urls: {
        info: 'https://isthereanydeal.com/game/tomclancysghostreconwildlands/info/',
        history: 'https://isthereanydeal.com/game/tomclancysghostreconwildlands/history/',
        bundles: 'https://isthereanydeal.com/specials/#/filter:search/tomclancysghostreconwildlands',
      },
    },
  });

  expect(formattedPriceData).toEqual(expected);
});

test('formatPriceData returns FORMATTING_ERROR when passed invalid price data', () => {
  const expected = 'FORMATTING_ERROR';

  const formattedPriceData = formatPriceData('Game name', {});

  expect(formattedPriceData).toEqual(expected);
});
