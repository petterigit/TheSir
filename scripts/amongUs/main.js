const _ = require('lodash');
const Discord = require('discord.js');

const NO_TARGET_MESSAGES = ['where', 'who', 'why', 'where?', 'who?', 'why?'];

let impostor;

exports.sus = async (message) => {
  if (!message.channel) {
    return;
  }

  if (!impostor) {
    impostor = (async () => {
      const { channel } = message;

      const impostor = channel.members
        .filter((member) => !member.user.bot)
        .random();

      await impostor.send('You are The Impostor.');

      return impostor;
    })();
  }

  const target = message.mentions.users.first();

  if (!target) {
    await message.reply(_.sample(NO_TARGET_MESSAGES));
    return;
  }

  const embed = new Discord.MessageEmbed();

  if (!message.guild) {
    return;
  }

  const guildTarget = await message.guild.members.fetch(target);

  const targetName = guildTarget.nickname || guildTarget.user.username;

  if (target.id === (await impostor).user.id) {
    embed.setColor('#00ff00').setTitle(`${targetName} was The Impostor.`);
    impostor = null;
  } else {
    embed
      .setColor('#ff0000')
      .setTitle(`${targetName} was not The Impostor.`)
      .setFooter('1 Impostor remains.');
  }

  await message.reply(embed);
};
