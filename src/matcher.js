const findCurlyBracesRegex = /\{.*?\}/g;
const removeCurlyBracesRegex = /{|}/g;

function matcher(message) {
  // our bot needs to know if it will execute a command
  // we match on {} pairs
  const commands = [];

  let messageMatch = findCurlyBracesRegex.exec(message);

  while (messageMatch) {
    const cmd = messageMatch[0].replace(removeCurlyBracesRegex, '');
    // only add unique commands
    if (!commands.includes(cmd)) commands.push(cmd);

    // look for the next match, if any
    messageMatch = findCurlyBracesRegex.exec(message);
  }

  return commands;
}

module.exports = matcher;
