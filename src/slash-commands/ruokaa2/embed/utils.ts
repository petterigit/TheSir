import { MessageEmbed } from "discord.js";
import { getFilename } from "../getAalefClips";
import fs from "fs";

export const createMenuEmbed = (restaurant: string) => {
    const filename = getFilename(restaurant);
    if (!fs.existsSync(filename)) return;
    const embed = new MessageEmbed()
        .setImage(`attachment://${getFilename(restaurant)}`)
        .setTitle(`Ruokalista - ${restaurant}`);
    return embed;
};
