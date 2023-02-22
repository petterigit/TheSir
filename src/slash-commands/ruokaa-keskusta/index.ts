import { CommandInteraction } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums";
import { SlashCommandModule } from "../../types";
import { createButtonRows } from "./components/buttonRow";
import { createMenuEmbeds } from "./embed/menus";
import { createMenuAttachments } from "./file/menuAttachments";
import { createTextEmbeds } from "./embed/textEmbeds";
import { launchPuppeteer } from "../../utils/ruokaa-utils/puppeteerUtils";
import { getRossoClips } from "./menus/getRossoClips";

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["ruokaa-keskusta"],
        description: "Daily lunch planner for keskusta restaurants",
    },
    async execute(message: CommandInteraction) {
        await ruokaa(message);
    },
};

const ruokaa = async (interaction: CommandInteraction) => {
    await interaction.deferReply();

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

    try {
        const textEmbeds = createTextEmbeds();
        const buttonRows = await createButtonRows();
        const menuEmbeds = createMenuEmbeds();
        const menuAttachments = createMenuAttachments();

        await interaction.editReply({
            embeds: [...menuEmbeds, ...textEmbeds],
            files: menuAttachments,
            components: [...buttonRows],
        });
    } catch (error) {
        await interaction.editReply(`Ei ruokalistoja. Error: ${error}`);
        console.error(error);
        return;
    }
};

export default command;
