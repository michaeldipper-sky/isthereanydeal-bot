const Discord = require('discord.io');
const logger = require('winston');
const matcher = require('./matcher');
const itad = require('./itad');
const createHTTPServer = require('./http');
const { formatPriceMessage } = require('./util/format');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});

logger.level = process.env.LOGGER_MODE || 'info';
logger.info('Starting bot...');

// Initialize Discord Bot
const bot = new Discord.Client({
  token: process.env.DISCORD_TOKEN || '',
  autorun: true,
});

logger.debug('Initialised');

function sendMessage(channelID, message) {
  bot.sendMessage({
    to: channelID,
    message,
  });
}

bot.on('ready', () => {
  // create a basic HTTP server so Heroku won't turn off the app :)
  createHTTPServer();

  logger.info('Bot connected and ready!');
  logger.debug(`Logged in as: ${bot.username} - (${bot.id})`);
});

bot.on('message', (user, userID, channelID, message) => {
  logger.debug(`Message received: ${message}`);

  // use the regex matcher to get the commands
  const commands = matcher(message);

  commands.forEach((cmd) => {
    logger.debug(`Executing command: ${cmd}`);

    switch (cmd) {
      case 'ping':
        sendMessage(channelID, 'pong');
        break;
      default: {
        // run the ITAD logic for each match
        logger.debug(`Attemping to find game data for ${cmd}`);
        let reply;
        itad(cmd)
          .then((gamePrice) => {
            // build the reply based on the respose from the API
            if (gamePrice === 'PARSE_ERROR') {
              reply = 'Error parsing price data. The game may not be for sale.';
            } else if (gamePrice === 'NO_ITAD') {
              reply = "Couldn't connect to ITAD. Please try again later.";
            } else {
              reply = formatPriceMessage(cmd, gamePrice);
              logger.info(`Got data for ${cmd}: ${gamePrice.name} (called by ${user})`);
            }

            // log the reply and send it
            logger.debug(reply);
            sendMessage(channelID, reply);
          })
          .catch(() => {
            reply = `Couldn't find a match for ${cmd}`;
            sendMessage(channelID, reply);
          });
        break;
      }
    }
  });
});
