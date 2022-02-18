const Discord = require('discord.js');
const logger = require('winston');
const matcher = require('./matcher');
const { isThereAnyDeal } = require('./itad');
const { cdKeys } = require('./cdkeys');

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
  if (msg.author.id !== '682941502673911871') {
    logger.debug(`Message received: ${msg.content}`);
  }

  // use the regex matcher to get the commands
  const commands = matcher(msg.content);

  commands.forEach((cmd) => {
    logger.debug(`Executing command: ${cmd}`);

    switch (cmd) {
      case 'ping':
        logger.debug('pong');
        msg.channel.send('pong');
        break;
      default: {
        if (cmd.length === 0) {
          logger.debug(`No content provided (called by ${msg.author.tag})`);
          msg.channel.send(
            'You need to actually provide something to search for :expressionless:',
          );
          break;
        }

        logger.debug(
          `Attemping to find ITAD data for ${cmd} (called by ${msg.author.tag})`,
        );
        isThereAnyDeal(cmd).then((reply) => {
          logger.debug(reply);
          msg.channel.send(reply);
        });

        logger.debug(
          `Attemping to find CDKeys data for ${cmd} (called by ${msg.author.tag})`,
        );
        cdKeys(cmd).then((reply) => {
          logger.debug(reply);
          msg.channel.send(reply);
        });

        break;
      }
    }
  });
});
