const Discord = require('discord.js');

function buildEmbed(title, source, url, desc, image) {
  const embed = new Discord.MessageEmbed()
    .setTitle(title || '')
    .setAuthor(source)
    .setURL(url)
    .setDescription(desc || '')
    .setThumbnail(image);

  return embed;
}

module.exports = { buildEmbed };
