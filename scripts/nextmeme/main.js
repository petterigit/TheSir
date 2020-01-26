"use strict";

const nextmeme = require("./nextmeme.js");

const emoji = {
    megusta: "658413442083848214",
    rageface: "658413628403351617"
}

exports.getMeme = async (message) => {
    try {
        const res = await nextmeme.nextMeme();

        const date = new Date(res.timestamp * 1000);
        const embed = {
            image: {url: res.url},
            description: `Posted: ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
        }
        const mes = await message.channel.send({embed: embed});

        try {
            await mes.react(emoji.rageface);
            await mes.react(emoji.megusta);
        }

        // Bot doesn't have access to the emojis
        // Use fallback emojis
        catch(error) {
            try {
                await mes.react("👎");
                await mes.react("👍");
            }
            catch(error) {
                console.log("Error eith reactions:\n" + error)
            }
        }
        
    }
    catch(error) {
        message.channel.send("The meme died before delivery.");
        console.log("Meme fetch error:\n" + error);
    }
}
