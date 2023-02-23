import { MessageAttachment, MessageEmbed } from "discord.js";
import fs from "node:fs";

export const createMenuEmbed = (ss: {
    filename: string;
    fileLoc: string;
    title: string;
}) => {
    const embed = new MessageEmbed()
        .setImage(`attachment://${ss.filename}`)
        .setTitle(`Ruokalista - ${ss.title}`);
    return embed;
};

export const createAttachment = (fileloc: string, filename?: string) => {
    if (!fs.existsSync(fileloc)) {
        return undefined;
    }

    return new MessageAttachment(fileloc, filename);
};
