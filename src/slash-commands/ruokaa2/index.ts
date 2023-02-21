import { CommandInteraction } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums";
import { SlashCommandModule } from "../../types";
import { createButtonRow } from "./components/buttonRow";
import { createMenuEmbeds } from "./embed/menus";
import { createMenuAttachments } from "./file/menuAttachments";
import { createKeskustaEmbed } from "./embed/keskustaEmbed";
import { getAalefClips } from "./menus/getAalefClips";
import { launchPuppeteer } from "./puppeteerUtils";
import { getLutBuffetClip } from "./menus/getLutBuffetClip";
import { getRossoClips } from "./menus/getRossoClips";

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
        const browser = await launchPuppeteer();

        await getAalefClips(browser);
        await getLutBuffetClip(browser);
        await getRossoClips(browser);

        await browser.close();
    } catch (error) {
        await interaction.editReply(
            "Something went wrong while getting menus. Sorry :|"
        );
        console.error(error);
        return;
    }

    try {
        const keskustaEmbed = createKeskustaEmbed();
        const buttonRow = await createButtonRow();
        const menuEmbeds = createMenuEmbeds();
        const menuAttachments = createMenuAttachments();

        await interaction.editReply({
            embeds: [...menuEmbeds, keskustaEmbed],
            files: menuAttachments,
            components: [buttonRow],
        });
    } catch (error) {
        await interaction.editReply(`Ei ruokalistoja. Error: ${error}`);
        console.error(error);
        return;
    }
};

export default command;
