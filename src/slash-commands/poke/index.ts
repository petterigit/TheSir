import {
    ApplicationCommandOptionData,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChatInputCommandInteraction,
} from "discord.js";
import { SlashCommandModule } from "../../types";
import { createUserMentionWithId, isMentionGuildMember } from "../../util";

const inputs: ApplicationCommandOptionData[] = [
    {
        type: ApplicationCommandOptionType.Mentionable,
        name: "user",
        description: "Someone to poke",
        required: true,
    },
];

const poke = async (interaction: ChatInputCommandInteraction) => {
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
        type: ApplicationCommandType.ChatInput,
        name: ["poke"],
        description: "Poke your friends and family!",
        options: inputs,
    },
    async execute(interaction: ChatInputCommandInteraction) {
        await poke(interaction);
    },
};

export default command;
