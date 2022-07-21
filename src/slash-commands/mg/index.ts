import { CommandInteraction, MessageAttachment } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums";
import { SlashCommandModule } from "../../types";

import { getNicknameOrName } from "../../util";
import { genCommandOptions, generateMeme, MemeOptions } from "./MemeGenerator";

const mg = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const data = interaction.options.data[0] as unknown as MemeOptions;
    const memer = getNicknameOrName(interaction);

    try {
        const buffer = await generateMeme(data);
        const attachment = new MessageAttachment(buffer, "reaction.jpg");
        interaction.editReply({
            content: `${memer} created a ${data.name} meme!`,
            files: [attachment],
        });
        //interaction.editReply({ content: "aaaa" });
    } catch (error) {
        interaction.editReply({ content: "Meme generator is broken" });
        console.log(error);
        return;
    }
};

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["mg"],
        description:
            "Everyone deserves some praise (or shame) every once in a while",
        options: genCommandOptions(),
    },
    async execute(message: CommandInteraction) {
        await mg(message);
    },
};

export default command;
