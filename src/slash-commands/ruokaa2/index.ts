import { CommandInteraction } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums";
import { SlashCommandModule } from "../../types";
import { createVoteEmbed } from "./embed/voteEmbed";
import { createButtonRow } from "./components/buttonRow";
import { createMenuEmbeds } from "./embed/menus";
import { createMenuAttachments } from "./file/menuAttachments";
import { getAalefClips } from "./getAalefClips";

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["ruokaa2"],
        description: "Daily lunch planner (highly experimental version)",
    },
    async execute(message: CommandInteraction) {
        await ruokaa(message);
    },
};

const ruokaa = async (interaction: CommandInteraction) => {
    await interaction.deferReply();

    try {
        getAalefClips();
    } catch (error) {
        interaction.editReply(
            "Something went wrong while getting menus. Sorry :|"
        );
        console.error(error);
        return;
    }

    try {
        const voteEmbed = await createVoteEmbed();
        const buttonRow = await createButtonRow();
        const menuEmbeds = createMenuEmbeds();
        const menuAttachments = createMenuAttachments();

        await interaction.editReply({
            embeds: [...menuEmbeds, voteEmbed],
            files: menuAttachments,
            components: [buttonRow],
        });
    } catch (error) {
        interaction.editReply(`Ei ruokalistoja. Error: ${error}`);
        console.error(error);
        return;
    }
};

export default command;
