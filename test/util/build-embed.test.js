const Discord = require('discord.js');
const { buildEmbed } = require('../../src/util/build-embed');

test('buildEmbed returns a correctly formatted embed object with all params', () => {
  const expected = new Discord.MessageEmbed()
    .setTitle('Game name: price')
    .setAuthor('Source')
    .setURL('https://gameshop.com/game')
    .setDescription('This is an example game')
    .setThumbnail('https://gameshop.com/game/thumbnail');

  const embed = buildEmbed(
    'Game name: price',
    'Source',
    'https://gameshop.com/game',
    'This is an example game',
    'https://gameshop.com/game/thumbnail',
  );
  expect(embed).toEqual(expected);
});

test('buildEmbed returns a correctly formatted embed object with missing title', () => {
  const expected = new Discord.MessageEmbed()
    .setTitle('')
    .setAuthor('Source')
    .setURL('https://gameshop.com/game')
    .setDescription('This is an example game')
    .setThumbnail('https://gameshop.com/game/thumbnail');

  const embed = buildEmbed(
    null,
    'Source',
    'https://gameshop.com/game',
    'This is an example game',
    'https://gameshop.com/game/thumbnail',
  );
  expect(embed).toEqual(expected);
});

test('buildEmbed returns a correctly formatted embed object with missing description', () => {
  const expected = new Discord.MessageEmbed()
    .setTitle('Game name: price')
    .setAuthor('Source')
    .setURL('https://gameshop.com/game')
    .setDescription('')
    .setThumbnail('https://gameshop.com/game/thumbnail');

  const embed = buildEmbed(
    'Game name: price',
    'Source',
    'https://gameshop.com/game',
    null,
    'https://gameshop.com/game/thumbnail',
  );
  expect(embed).toEqual(expected);
});
