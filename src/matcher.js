function matcher(message) {
  // Our bot needs to know if it will execute a command
  // We match on {} pairs
  const regexp = /\{.*?\}/g;
  const commands = [];

  let messageMatch = regexp.exec(message);

  while (messageMatch) {
    const cmd = messageMatch[0].replace(/{|}/g, '');
    // Only add unique commands
    if (!commands.includes(cmd)) commands.push(cmd);

    // Look for the next match, if any
    messageMatch = regexp.exec(message);
  }

  return commands;
}

module.exports = matcher;
