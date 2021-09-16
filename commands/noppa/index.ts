const { DiceRoller } = require("dice-roller-parser");
import {Message} from 'discord.js'

const diceRoller = new DiceRoller();

const noppa = async (message: Message ) => {
  const args = message.content.split(" ").slice(2);
  if (args.length < 1) {
    await message.reply("anna (*tirsk*) pliis jotain heitettävää :c");
    return;
  }

  const dieString = args.join(" ");

  let value;

  try {
    value = diceRoller.rollValue(dieString);
  } catch (err) {
    await message.reply(`heitto meni pieleen :c`);
    return;
  }

  await message.reply(`heiton tulos (*tirsk*) oli ${value}`);
};

module.exports = {
  data: {
    name: ["noppa"],
    description: "Roll a dice!",
  },
  async execute(message: Message) {
    await noppa(message);
  },
};
