import {
    ApplicationCommandType,
    ChatInputCommandInteraction,
} from "discord.js";
import { getNicknameOrName } from "../../util";

const f = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const user = getNicknameOrName(interaction);
    const msg = `${user} has paid their respects`;

    await interaction.editReply(msg);
    return;
};

module.exports = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: ["f"],
        description: "F in the chat bois",
    },
    async execute(interaction: ChatInputCommandInteraction) {
        await f(interaction);
    },
};
