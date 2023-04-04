import { GuildMember, Message, EmbedBuilder, TextChannel } from "discord.js";

import sample from "lodash/sample";

const NO_TARGET_MESSAGES = ["where", "who", "why", "where?", "who?", "why?"];

let impostor: Promise<GuildMember> | null;

const sus = async (message: Message) => {
    if (!message.channel) {
        return;
    }

    if (!impostor) {
        impostor = (async () => {
            const { channel } = message;

            const impostor = (channel as TextChannel).members
                .filter((member) => !member.user.bot)
                .random();

            await impostor.send("You are The Impostor.");

            return impostor;
        })();
    }

    const target = message.mentions.users.first();

    if (!target) {
        await message.reply(sample(NO_TARGET_MESSAGES) as string);
        return;
    }

    const embed = new EmbedBuilder();

    if (!message.guild) {
        return;
    }

    const guildTarget = await message.guild.members.fetch(target);

    const targetName = guildTarget.nickname || guildTarget.user.username;

    if (target.id === (await impostor).user.id) {
        embed.setColor("#00ff00").setTitle(`${targetName} was The Impostor.`);
        impostor = null;
    } else {
        embed
            .setColor("#ff0000")
            .setTitle(`${targetName} was not The Impostor.`)
            .setFooter({ text: "1 Impostor remains." });
    }

    await message.reply({ embeds: [embed] });
};

module.exports = {
    data: {
        name: "sus",
        description: "Play Among Us in Discord brah",
    },
    async execute(message: Message) {
        await sus(message);
    },
};
