/* IMPORT const kortteja = require('./scripts/kortteja/main.js');
/* MAIN kortteja(message)
 */

import { Message } from "discord.js";

import axios from "axios";

const cardGameUrl = "http://pelit.space";
const newGamePath = "/g";

const kortteja = async (message: Message) => {
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

        message.channel.send({ embeds: [embed] });
    } catch (e) {
        message.channel.send(`Korttipelin aloittaminen ei onnistunut :((`);
    }
};

module.exports = {
    data: {
        name: "kortteja",
        description: "Luo uuden Kortit ihmiskuntaa vastaan pelin",
    },
    async execute(message: Message) {
        await kortteja(message);
    },
};
