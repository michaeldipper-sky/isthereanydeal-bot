const Discord = require('discord.js');
const logger = require('winston');
const matcher = require('./matcher');
const { isThereAnyDeal, searchForTitle } = require('./itad');
const { formatPriceMessage } = require('./util/format');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});

logger.level = process.env.LOGGER_MODE || 'info';
logger.info('Starting bot...');

// Initialize Discord Bot
const bot = new Discord.Client();
bot.login(process.env.DISCORD_TOKEN || '');

logger.debug('Initialised');

bot.on('ready', () => {
  logger.info('Bot connected and ready!');
  logger.debug(`Logged in as: ${bot.user.tag} - (${bot.user.id})`);

  bot.user.setStatus('available');
  bot.user.setActivity('for {game title}', {
    type: 'WATCHING',
  });
});

bot.on('message', (msg) => {
  if (msg.author.id !== '682941502673911871') logger.debug(`Message received: ${msg.content}`);

  // use the regex matcher to get the commands
  const commands = matcher(msg.content);

  commands.forEach((cmd) => {
    logger.debug(`Executing command: ${cmd}`);

    switch (cmd) {
      case 'ping':
        logger.debug('pong');
        msg.channel.send('pong');
        break;
      case 'game title':
        logger.debug('I knew you would do that');
        msg.channel.send('I knew you would do that');
        break;
      default: {
        // run the ITAD logic for each match
        logger.debug(
          `Attemping to find game data for ${cmd} (called by ${msg.author.tag})`,
        );
        let reply;
        isThereAnyDeal(cmd)
          .then((gamePrice) => {
            // build the reply based on the respose from the API
            if (gamePrice === 'PARSE_ERROR') {
              return searchForTitle(cmd);
            }
            if (gamePrice === 'NO_ITAD') {
              reply = "Couldn't connect to ITAD :grimacing: Please try again later!";
            } else {
              reply = formatPriceMessage(cmd, gamePrice);
              logger.info(`Got data for ${cmd}: ${gamePrice.name}`);
            }
            return 'NOT_REQUIRED';
          })
          .then((searchResult) => {
            if (searchResult === 'SEARCH_ERROR') {
              reply = 'Error parsing price data. The game may not be for sale.';
            } else if (searchResult !== 'NOT_REQUIRED') {
              reply = `Couldn't find that :thinking: Did you mean ${searchResult}?`;
            }
          })
          .catch(() => {
            // no match from the API
            reply = `Couldn't find a match for ${cmd} :disappointed:`;
          })
          .finally(() => {
            // log the reply and send it
            logger.debug(reply);
            msg.channel.send(reply);
          });
        break;
      }
    }
  });
});
