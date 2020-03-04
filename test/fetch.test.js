const axios = require('axios');
const { fetchPlain } = require('../src/fetch');

jest.mock('axios');

test('API returns a plain for a game that exists', () => {
  const plain = 'astroneer';
  const expectedResponse = {
    '.meta': {
      match: 'title',
      active: true,
    },
    data: {
      plain,
    },
  };

  axios.get.mockResolvedValue(expectedResponse);

  return fetchPlain('Astroneer').then((data) => {
    expect(data).toEqual({ plain });
  });
});
