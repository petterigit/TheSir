/* IMPORT const kortteja = require('./scripts/kortteja/main.js');
/* MAIN kortteja(message)
 */

import { ApplicationCommandType, CommandInteraction } from "discord.js";

import axios from "axios";
import { SlashCommandModule } from "../../types";

const cardGameUrl = "http://pelit.space";
const newGamePath = "/g";

const kortteja = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const url = `${cardGameUrl}${newGamePath}`;
    try {
        const response = await axios(url, { method: "POST" });
        const json = await response.data;

        const embed = {
            title: "Kortit ihmiskuntaa vastaan",
            url: `${cardGameUrl}${newGamePath}/${json.url}`,
            description: `Tule (tirsk) pelaamaan kortteja ihmiskuntaa vastaan!
      Peli: ${json.url}
      `,
        };

        interaction.editReply({ embeds: [embed] });
    } catch (e) {
        interaction.editReply(`Korttipelin aloittaminen ei onnistunut :((`);
    }
};

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: "cards-against-humankind",
        description: "Create a new game of Cards Against Humankind",
    },
    async execute(interaction: CommandInteraction) {
        await kortteja(interaction);
    },
};

export default command;
