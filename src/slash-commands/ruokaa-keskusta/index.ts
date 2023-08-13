import {
    ApplicationCommandType,
    ChatInputCommandInteraction,
} from "discord.js";
import { SlashCommandModule } from "../../types";
import { createButtonRows } from "./components/buttonRow";
import { createMenuEmbeds } from "./embed/menus";
import { createMenuAttachments } from "./file/menuAttachments";
import { createTextEmbeds } from "./embed/textEmbeds";
import { launchPuppeteer } from "../../utils/ruokaa-utils/puppeteerUtils";
import { getRossoClips } from "./menus/getRossoClips";
import { createEmptyVotingEmbed } from "../../utils/interactionUtils";

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: ["ruokaa-keskusta"],
        description: "Daily lunch planner for keskusta restaurants",
    },
    async execute(message: ChatInputCommandInteraction) {
        await ruokaa(message);
    },
};

const ruokaa = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();

    /* No menu screenshots for now :]
    try {
        const browser = await launchPuppeteer();

        await getRossoClips(browser);

        await browser.close();
    } catch (error) {
        await interaction.editReply(
            "Something went wrong while getting menus. Sorry :|"
        );
        console.error(error);
        return;
    }
    */

    try {
        const textEmbeds = createTextEmbeds();
        const buttonRows = await createButtonRows();
        const menuEmbeds = createMenuEmbeds();

        /* No menu screenshots for now :]
        const menuAttachments = createMenuAttachments();
        */

        await interaction.editReply({
            embeds: [...menuEmbeds, ...textEmbeds],
            /* No menu screenshots for now :]
            files: menuAttachments,
            */
        });

        const votingEmbed = createEmptyVotingEmbed();

        await interaction.followUp({
            embeds: [votingEmbed],
            components: [...buttonRows],
        });
    } catch (error) {
        await interaction.editReply(`Ei ruokalistoja. Error: ${error}`);
        console.error(error);
        return;
    }
};

export default command;
