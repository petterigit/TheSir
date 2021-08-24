const Praise = require("./praise.js");
const Discord = require("discord.js");
const { getNicknameOrName } = require("../../util.js");

praise = async (message, shameInstead = false) => {
  const mentions = message.mentions;

  if (mentions.members.size != 0 || mentions.everyone) {
    let buffer = null;
    try {
      buffer = await Praise.generatePraise(shameInstead);
    } catch (error) {
      message.channel.send("Praise machine is broken");
      console.log(error);
      return;
    }

    const attachment = new Discord.MessageAttachment(buffer, "reaction.jpg");

    let text = "";
    const sender = getNicknameOrName(message);
    if (mentions.everyone) {
      if (shameInstead) {
        text = `${sender} shames everyone!`;
      } else {
        text = `${sender} praises everyone!`;
      }
    } else {
      let names = mentions.users.map((value, key) => {
        const member = mentions.members.get(key);
        return member.nickname || value.username;
      });
      let users = "";
      for (let i = 0; i < names.length; i++) {
        if (i == 0) {
          users += names[i];
        } else if (i == names.length - 1) {
          users += ` and ${names[i]}`;
        } else {
          users += `, ${names[i]}`;
        }
      }
      if (shameInstead) {
        text = `${sender} shames ${users}!`;
      } else {
        text = `${sender} praises ${users}!`;
      }
    }

    try {
      message.channel.send({ content: text, files: [attachment] });
    } catch (error) {
      console.log("Failed to send message from praise");
    }
  } else {
    try {
      message.channel.send("You need to @ someone");
    } catch (error) {
      console.log("Failed to send message from praise");
    }
  }
};

module.exports = {
  data: {
    name: ["praise", "shame"],
    description:
      "Praise a fellow Discord dude or shame them for saying something stupid",
  },
  async execute(message) {
    await praise(message, message.content?.includes("shame"));
  },
};
