const Discord = require('discord.js');
const logger = require('winston');
const { CronJob } = require('cron');
const matcher = require('./util/matcher');
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
  bot.user.setActivity('for {game title}', {
    type: 'WATCHING',
  });
});

bot.on('message', (msg) => {
  if (msg.author.id !== '682941502673911871') {
    logger.debug(`Message received: ${msg.content}`);
  }

  const commands = matcher(msg.content);

  commands.forEach(async (cmd) => {
    logger.debug(`Executing command: ${cmd} (called by ${msg.author.tag})`);

    switch (cmd) {
      case 'ping':
        msg.channel.send('pong');
        break;
      default: {
        if (cmd.length === 0) {
          msg.channel.send(
            'You need to actually provide something to search for :expressionless:',
          );
          break;
        }

        const itadReply = await isThereAnyDeal(cmd);
        const cdKeysReply = await cdKeys(cmd);
        const gamePassReply = gamePass(cmd);

        msg.channel.send(itadReply);
        msg.channel.send(cdKeysReply);
        if (gamePassReply) msg.channel.send(gamePassReply);

        break;
      }
    }
  });
});
