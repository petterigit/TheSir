"use strict";

import { Message } from "discord.js";

/* IMPORT const nextMeme = require('./scripts/nextmeme/main.js');
/* MAIN getMeme(message)
 */

import { nextMeme } from "./nextmeme";

const emoji = {
    megusta: "658413442083848214",
    rageface: "658413628403351617",
};

const getMeme = async (message: Message) => {
    try {
        const res = await nextMeme();

        const date = new Date(res.timestamp * 1000);
        const embed = {
            image: { url: res.url },
            description: `Posted: ${date.getDate()}.${
                date.getMonth() + 1
            }.${date.getFullYear()}`,
        };
        const mes = await message.channel.send({ embeds: [embed] });

        try {
            await mes.react(emoji.rageface);
            await mes.react(emoji.megusta);
        } catch (error) {
            // Bot doesn't have access to the emojis
            // Use fallback emojis
            try {
                await mes.react("👎");
                await mes.react("👍");
            } catch (error) {
                console.log("Error with reactions:\n" + error);
            }
        }
    } catch (error) {
        message.channel.send("The meme died before delivery.");
        console.log("Meme fetch error:\n" + error);
    }
};

module.exports = {
    data: {
        name: ["meme"],
        description:
            "Gets a random meme from a collection of over a million memes (they are all bad)",
    },
    async execute(message: Message) {
        await getMeme(message);
    },
};
