const Discord = require('discord.js');

function buildEmbed(title, source, url, desc, imageUrl) {
  const embed = new Discord.MessageEmbed()
    .setTitle(title || '')
    .setAuthor(source)
    .setURL(url)
    .setDescription(desc || '')
    .setThumbnail(imageUrl);

  return embed;
}

module.exports = { buildEmbed };
