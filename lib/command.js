const stringSimilarity = require('string-similarity'); // Ensure this is required for string similarity
const commands = [];
const handler = [];
const PREFIX = '^[.,!]';

function Miya(info, func) {
  const types = ['image', 'text', 'video', 'sticker', 'audio'];

  const infos = {
    onlyOwner: info.onlyOwner ?? false,
    onlyPrem: info.onlyPrem ?? false,
    onlyGroup: info.onlyGroup ?? false,
    onlyAdmins: info.onlyAdmins ?? false,
    onlyPm: info.onlyPm ?? false,
    limit: info.limit ?? false,
    glimit: info.glimit ?? false,
    desc: info.desc ?? '',
    type: info.type ?? 'misc',
    dontAddCommandList: info.dontAddCommandList ?? false,
    function: func
  };

  if (!info.on && !info.command) {
    infos.on = 'message';
    infos.fromMe = false;
  } else {
    if (info.on) {
      infos.on = info.on;
      if (info.command) {
        infos.command = new RegExp(info.command);
      }
    } else {
      infos.command = new RegExp(info.command);
    }
  }

  // Check for existing command with the same name and command
  const existingCommandIndex = commands.findIndex(Miya => Miya.name === infos.name && Miya.command.toString() === infos.command.toString());

  // If an existing command is found, replace it with the new command
  if (existingCommandIndex !== -1) {
    commands[existingCommandIndex] = infos;
  } else {
    // If no existing command is found, add the new command to the array
    commands.push(infos);
  }

  return infos;
}

function Handler(func) {
  const infos = {
    function: func,
    on: 'message',
    fromMe: false
  };

  handler.push(infos);
  return infos; // Return the infos object
}

function suggestCommand(command) {
  // Generate an array of all command patterns as strings
  const commandList = commands.map(Miya => Miya.command instanceof RegExp ? Miya.command.source : Miya.command);

  // Find the best match from the list using string similarity
  const matches = stringSimilarity.findBestMatch(command, commandList);

  // If a match with a high rating is found, return the suggestion
  if (matches.bestMatch.rating > 0.5) {
    return `Did you mean: ${matches.bestMatch.target}?`;
  }
  return null;
}

module.exports = {
  Miya,
  commands,
  Handler,
  handler,
  suggestCommand, // Export the dynamic suggestion function
};
