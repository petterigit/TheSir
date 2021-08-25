const Discord = require("discord.js");

const intents = [
  Discord.Intents.FLAGS.DIRECT_MESSAGES,
  Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  Discord.Intents.FLAGS.GUILDS,
  Discord.Intents.FLAGS.GUILD_MESSAGES,
  Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
];

exports.intents = intents;
