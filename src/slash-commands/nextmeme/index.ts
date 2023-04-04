import {
    ApplicationCommandType,
    ChatInputCommandInteraction,
    MessageEditOptions,
} from "discord.js";
import { SlashCommandModule } from "../../types";
import { isMessage } from "../../util";

import { nextMeme } from "./nextmeme";

const emoji = {
    megusta: "658413442083848214",
    rageface: "658413628403351617",
};

const getMeme = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    try {
        const res = await nextMeme();
        if (!res) throw new Error("No meme found");

        const date = new Date(res.timestamp * 1000);

        let options: MessageEditOptions = {};
        const formattedDate = `${date.getDate()}.${
            date.getMonth() + 1
        }.${date.getFullYear()}`;

        // Image
        if (res.type === 1) {
            const embed = {
                image: { url: res.url },
                description: `Originally posted in ${formattedDate}`,
            };
            options = { embeds: [embed] };

            // Video
        } else if (res.type === 2) {
            options = {
                content: `Originally posted in ${formattedDate}: ${res.url}`,
            };
        } else {
            throw new Error("Unknown meme type");
        }

        const message = await interaction.editReply(options);
        if (!isMessage(message)) return;

        try {
            await message.react(emoji.rageface);
            await message.react(emoji.megusta);
        } catch (error) {
            // Bot doesn't have access to the emojis
            // Use fallback emojis
            try {
                await message.react("👎");
                await message.react("👍");
            } catch (error) {
                console.log("Error with reactions:\n" + error);
            }
        }
    } catch (error) {
        interaction.editReply("The meme died before delivery.");
        console.log("Meme fetch error:\n" + error);
    }
};

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: ["meme"],
        description:
            "Gets a random meme from a collection of over a million memes (they are all bad)",
    },
    async execute(interaction: ChatInputCommandInteraction) {
        await getMeme(interaction);
    },
};

export default command;
