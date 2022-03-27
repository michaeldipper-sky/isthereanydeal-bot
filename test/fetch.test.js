const axios = require('axios');
const { fetchItadPlain } = require('../src/util/fetch');

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

  return fetchItadPlain('Astroneer').then((data) => {
    expect(data).toEqual({ plain });
  });
});
