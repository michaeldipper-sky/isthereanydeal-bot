const fs = require('fs/promises');
const logger = require('winston');
const { fetchGamePassIds, fetchGamePassGames } = require('../../src/util/fetch');
const generateGamePassJson = require('../../src/util/generate-game-pass-json');

jest.mock('fs/promises');
fs.writeFile.mockImplementation(async () => {});

jest.mock('winston', () => ({
  error: jest.fn(),
  info: jest.fn(),
}));

jest.mock('../../src/util/fetch');
fetchGamePassIds.mockImplementation(async () => [
  'metadata',
  {
    id: 'id 1',
  },
  {
    id: 'id 2',
  },
]);
fetchGamePassGames.mockImplementation(async () => ({
  Products: [
    {
      LocalizedProperties: [{ ProductTitle: 'Game one', Images: [{ ImagePurpose: 'BoxArt', Uri: 'https://site.com/image.jpg' }] }],
    },
    {
      LocalizedProperties: [{ ProductTitle: 'Game two', Images: [] }],
    },
  ],
}));

test('generateGamePassJson writes a file with game pass info', async () => {
  const fileContents = '[{"title":"Game one","boxArtUri":"https:https://site.com/image.jpg"},{"title":"Game two","boxArtUri":null}]';

  await generateGamePassJson();
  expect(fetchGamePassIds).toHaveBeenCalledTimes(1);
  expect(fetchGamePassGames).toHaveBeenCalledWith('id 1,id 2');
  expect(fs.writeFile).toHaveBeenCalledWith('game-pass-games.json', fileContents, 'utf8');
  expect(logger.info).toHaveBeenCalledWith('Successfully updated game pass data');
});

test('generateGamePassJson fails gracefully if it can\'t fetch data', async () => {
  fetchGamePassIds.mockImplementationOnce(async () => { throw new Error('Mock failed request'); });

  await generateGamePassJson();
  expect(logger.error).toHaveBeenCalledWith('Unable to fetch Game Pass data due to exception (Error: Mock failed request)');
});

test('generateGamePassJson fails gracefully if it can\'t write the file', async () => {
  fs.writeFile.mockImplementationOnce(async () => { throw new Error('Mock failed write'); });

  await generateGamePassJson();
  expect(logger.error).toHaveBeenCalledWith('Unable to write Game Pass data due to exception (Error: Mock failed write)');
});
