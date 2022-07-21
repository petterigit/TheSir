import { CommandInteraction } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums";
import { SlashCommandModule } from "../../types";

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["ping"],
        description: "Ping!",
    },
    async execute(interaction: CommandInteraction) {
        await interaction.reply("Pong!");
    },
};

export default command;
