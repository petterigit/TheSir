import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";
import {
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
} from "discord.js/typings/enums";
import { SlashCommandModule } from "../../types";
import { createUserMentionWithId, isMentionGuildMember } from "../../util";

const inputs: ApplicationCommandOptionData[] = [
    {
        type: ApplicationCommandOptionTypes.MENTIONABLE,
        name: "user",
        description: "Someone to poke",
        required: true,
    },
];

const poke = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    try {
        const user = interaction.options.getMentionable("user");
        if (!isMentionGuildMember(user)) {
            interaction.editReply({ content: "You need to mention a user" });
            return;
        }

        user.send(`Poked by **${interaction.user.username}!**`);
        await interaction.editReply(
            `**Wakey wakey ${createUserMentionWithId(user.id)}!!!**`
        );
    } catch (error) {
        console.log(error);
        await interaction.editReply("Something did not work correctly");
    }
};

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["poke"],
        description: "Poke your friends and family!",
        options: inputs,
    },
    async execute(interaction: CommandInteraction) {
        await poke(interaction);
    },
};

export default command;
