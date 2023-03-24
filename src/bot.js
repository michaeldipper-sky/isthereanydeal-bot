const Discord = require('discord.js');
const logger = require('winston');
const { CronJob } = require('cron');
const generateGamePassJson = require('./util/generate-game-pass-json');
const { isThereAnyDeal } = require('./itad');
const cdKeys = require('./cd-keys');
const gamePass = require('./game-pass');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});

logger.level = process.env.LOGGER_MODE || 'info';
logger.info('Starting bot...');

generateGamePassJson();
const job = new CronJob(
  '0 0 4 * * *',
  generateGamePassJson,
  null,
  true,
  'Europe/London',
);
job.start();

const bot = new Discord.Client();
bot.login(process.env.DISCORD_TOKEN || '');

logger.debug('Initialised');

bot.on('ready', () => {
  logger.info('Bot connected and ready!');
  logger.debug(`Logged in as: ${bot.user.tag} - (${bot.user.id})`);

  bot.user.setStatus('available');
  bot.user.setActivity('for /itad game title', {
    type: 'WATCHING',
  });
});

const commandRegex = /\/watch (.+)|\/itad (.+)/;

bot.on('message', async (msg) => {
  if (msg.author.id === '682941502673911871') {
    return;
  }

  const commandMatch = msg.content.match(commandRegex);

  if (commandMatch) {
    const cmd = msg.content;
    logger.debug(`Executing command: ${cmd} (called by ${msg.author.tag})`);

    const game = commandMatch[2];

    if (cmd.startsWith('/itad')) {
      const itadReply = await isThereAnyDeal(game);
      const cdKeysReply = await cdKeys(game);
      const gamePassReply = gamePass(game);

      msg.channel.send(itadReply);
      msg.channel.send(cdKeysReply);
      if (gamePassReply) msg.channel.send(gamePassReply);

      return;
    }

    if (cmd.startsWith('/watch')) {
      msg.channel.send('Feature coming soon... :eyes:');
    }

    return;
  }
  msg.channel.send('You need to actually provide something to search for :expressionless:');
});
