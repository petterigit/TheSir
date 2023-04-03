import {
    ApplicationCommandType,
    ChatInputCommandInteraction,
} from "discord.js";
import { SlashCommandModule } from "../../types";
import { createEmptyVotingEmbed } from "../../utils/interactionUtils";
import { launchPuppeteer } from "../../utils/ruokaa-utils/puppeteerUtils";
import { createButtonRow } from "./components/buttonRow";
import { createMenuEmbeds } from "./embed/menus";
import { createMenuAttachments } from "./file/menuAttachments";
import { getAalefClips } from "./menus/getAalefClips";
import { getLutBuffetClip } from "./menus/getLutBuffetClip";

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: ["ruokaa-skinnarila"],
        description: "Daily lunch planner for Skinnarila restaurants",
    },
    async execute(message: ChatInputCommandInteraction) {
        await ruokaa(message);
    },
};

const ruokaa = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();

    try {
        const browser = await launchPuppeteer();

        await getAalefClips(browser);
        await getLutBuffetClip(browser);

        await browser.close();
    } catch (error) {
        await interaction.editReply(
            "Something went wrong while getting menus. Sorry :|"
        );
        console.error(error);
        return;
    }

    try {
        const buttonRow = await createButtonRow();
        const menuEmbeds = createMenuEmbeds();
        const menuAttachments = createMenuAttachments();

        await interaction.editReply({
            embeds: [...menuEmbeds],
            files: menuAttachments,
        });

        const votingEmbed = createEmptyVotingEmbed();

        await interaction.followUp({
            embeds: [votingEmbed],
            components: [buttonRow],
        });
    } catch (error) {
        await interaction.editReply(`Ei ruokalistoja. Error: ${error}`);
        console.error(error);
        return;
    }
};

export default command;
