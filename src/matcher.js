function matcher(message) {
  // our bot needs to know if it will execute a command
  // we match on {} pairs
  const regexp = /\{.*?\}/g;
  const commands = [];

  let messageMatch = regexp.exec(message);

  while (messageMatch) {
    const cmd = messageMatch[0].replace(/{|}/g, '');
    // only add unique commands
    if (!commands.includes(cmd)) commands.push(cmd);

    // look for the next match, if any
    messageMatch = regexp.exec(message);
  }

  return commands;
}

module.exports = matcher;
