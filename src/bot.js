const Discord = require('discord.js');
const logger = require('winston');
const { CronJob } = require('cron');
const generateGamePassJson = require('./util/generate-game-pass-json');
const { isThereAnyDeal } = require('./itad');
const cdKeys = require('./cd-keys');
const gamePass = require('./game-pass');
const { addGameToWatchList } = require('./watch');

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

const commandRegex = /(\/watch|\/itad) (.+)/;

bot.on('message', async (msg) => {
  if (msg.author.id === '682941502673911871') {
    return;
  }
  logger.debug(`Message received: ${msg.content}`);

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
      // make normal calls to itad to verify if the game can be found or something? DONE!
      // then add the user id and plain to a JSON - probably a 2d array of [user][game]
      // probably worth adding the name supplied by the user to the JSON
      //
      // will need an unwatch command, and maybe a list command? Oh and a help command!
      const itadReply = await isThereAnyDeal(game);
      itadReply.setFooter(
        'If this is the correct game, react to this message with 👍 to start watching it!',
      );

      const watchFilter = (reaction, user) => reaction.emoji.name === '👍' && user.id === msg.author.id;
      const confirmationMessage = await msg.channel.send(itadReply);
      const collector = confirmationMessage.createReactionCollector(
        watchFilter,
        { max: 1, time: 60000 },
      );

      collector.on('collect', (reaction, user) => {
        logger.debug(`Collected ${reaction.emoji.name} from ${user.id}`);

        addGameToWatchList(user, game);

        itadReply.setFooter('Watched!');
        confirmationMessage.edit('', itadReply);
      });

      collector.on('end', (collected) => {
        logger.debug(`Collected ${collected.size} items`);

        if (collected.size === 0) {
          itadReply.setFooter('Expired!');
          confirmationMessage.edit('', itadReply);
        }
      });
    }
  }
});
