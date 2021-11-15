import { ApplicationCommandTypes } from "discord.js/typings/enums";
import { CommandInteraction } from "discord.js";
import { getNicknameOrName } from "../../util";

const f = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const user = getNicknameOrName(interaction);
    const msg = `${user} has paid their respects`;

    await interaction.editReply(msg);
    return;
};

module.exports = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["f"],
        description: "F in the chat bois",
    },
    async execute(interaction: CommandInteraction) {
        await f(interaction);
    },
};
