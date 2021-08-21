const { DiceRoller } = require('dice-roller-parser');

const diceRoller = new DiceRoller();

exports.noppa = async (message) => {
  const args = message.content.split(' ').slice(2);
  if (args.length < 1) {
    await message.reply('anna (*tirsk*) pliis jotain heitettävää :c');
    return;
  }

  const dieString = args.join(' ');

  let value;

  try {
    value = diceRoller.rollValue(dieString);
  } catch (err) {
    await message.reply(`heitto meni pieleen :c`);
    return;
  }

  await message.reply(`heiton tulos (*tirsk*) oli ${value}`);
};
