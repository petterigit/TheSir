import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";
import {
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
} from "discord.js/typings/enums";
import { SlashCommandModule } from "../../types";
import { createCodeBlock, MESSAGE_MAX_LENGTH } from "../../util";
import { generateCowsay } from "./cowsay";

const inputs: ApplicationCommandOptionData[] = [
    {
        type: ApplicationCommandOptionTypes.STRING,
        name: "message",
        description: "What does the cow say?",
        required: false,
    },
    {
        type: ApplicationCommandOptionTypes.NUMBER,
        name: "width",
        description: "How wide should the cow say?",
        required: false,
    },
];

const errorMessage = "Cow could not be found for comment.";

const cowsay = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    let message = interaction.options.getString("message");
    const columns = interaction.options.getNumber("width");
    if (!message) message = "Moo moo mothertrucker!";

    try {
        const cowsay = generateCowsay(message, columns || undefined);
        const limitedCow = cowsay.substring(0, MESSAGE_MAX_LENGTH - 6);
        await interaction.editReply({
            content: createCodeBlock(limitedCow),
        });
    } catch (e) {
        await interaction.editReply({
            content: errorMessage,
        });
    }
};

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["cowsay"],
        description: "Moo?",
        options: inputs,
    },
    async execute(message: CommandInteraction) {
        await cowsay(message);
    },
};

export default command;
