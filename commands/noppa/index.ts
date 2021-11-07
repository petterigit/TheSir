import { DiceRoller } from "dice-roller-parser";
import { Message } from "discord.js";

const diceRoller = new DiceRoller();

const noppa = async (message: Message): Promise<void> => {
    const args = message.content.split(" ").slice(2);
    if (args.length < 1) {
        await message.reply("anna (*tirsk*) pliis jotain heitettävää :c");
        return;
    }

    const dieString = args.join(" ");

    let value = 0;

    try {
        value = diceRoller.rollValue(dieString);
    } catch (err) {
        await message.reply(`heitto meni pieleen :c`);
        return;
    }

    await message.reply(`heiton tulos (*tirsk*) oli ${value}`);
    return;
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
