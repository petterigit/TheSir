import {
    ApplicationCommandType,
    ChatInputCommandInteraction,
} from "discord.js";
import { SlashCommandModule } from "../../types";

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: ["ping"],
        description: "Ping!",
    },
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply("Pong!");
    },
};

export default command;
