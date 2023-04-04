import {
    ApplicationCommandOptionData,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChatInputCommandInteraction,
} from "discord.js";
import { SlashCommandModule } from "../../types";
import { createCodeBlock, MESSAGE_MAX_LENGTH } from "../../util";
import { generateCowsay } from "./cowsay";

const inputs: ApplicationCommandOptionData[] = [
    {
        type: ApplicationCommandOptionType.String,
        name: "message",
        description: "What does the cow say?",
        required: false,
    },
    {
        type: ApplicationCommandOptionType.Number,
        name: "width",
        description: "How wide should the cow say?",
        minValue: 1,
        maxValue: 200,
        required: false,
    },
];

const errorMessage = "Cow could not be found for comment.";

const cowsay = async (interaction: ChatInputCommandInteraction) => {
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
        type: ApplicationCommandType.ChatInput,
        name: ["cowsay"],
        description: "Moo?",
        options: inputs,
    },
    async execute(message: ChatInputCommandInteraction) {
        await cowsay(message);
    },
};

export default command;
