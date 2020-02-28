
const Discord = require('discord.io');
const logger = require('winston');
const auth = require('../auth.json');
const matcher = require('./matcher');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});

logger.level = 'info';
logger.info('Starting bot...');

// Initialize Discord Bot
const bot = new Discord.Client({
  token: auth.token,
  autorun: true,
});

logger.debug('Initialised');

bot.on('ready', () => {
  logger.info('Bot connected and ready!');
  logger.debug(`Logged in as: ${bot.username} - (${bot.id})`);
});

bot.on('message', (user, userID, channelID, message) => {
  logger.debug(`Message received: ${message}`);

  // Use the regex matcher to get the commands
  const commands = matcher(message);

  // Run the ITAD logic for each match
  commands.forEach((cmd) => {
    logger.debug(`Executing command: ${cmd}`);

    switch (cmd) {
      case 'ping':
        bot.sendMessage({
          to: channelID,
          message: 'Pong!',
        });
        break;
        // Just add any case commands if you want to..
      default: {
        break;
      }
    }
  });
});
