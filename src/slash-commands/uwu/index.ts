import {
    ApplicationCommandOptionData,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChatInputCommandInteraction,
} from "discord.js";
import { SlashCommandModule } from "../../types";
import owoify from "owoify-js";

const inputs: ApplicationCommandOptionData[] = [
    {
        type: ApplicationCommandOptionType.String,
        name: "message",
        description: "Message",
        required: true,
    },
];

const uwu = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();

    try {
        const message = interaction.options.getString("message");
        const owo = owoify(message ?? "", "uvu");
        const uwu = owo
            .replaceAll("\\", "\\\u200b")
            .replaceAll("`", "\\`")
            .replaceAll("_", "\\_")
            .replaceAll("*", "\\*")
            .replaceAll("|", "\\|")
            .replaceAll("-", "\\-");
        interaction.editReply(uwu.substring(0, 2000));
    } catch (error) {
        interaction.editReply("Something went wrong uwu");
        console.log(error);
    }
};

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: ["uwu"],
        description: "Send hewp",
        options: inputs,
    },
    async execute(interaction: ChatInputCommandInteraction) {
        await uwu(interaction);
    },
};

export default command;
