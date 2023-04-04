import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import fs from "node:fs";

export const createMenuEmbed = (ss: {
    filename: string;
    fileLoc: string;
    title: string;
}) => {
    const embed = new EmbedBuilder()
        .setImage(`attachment://${ss.filename}`)
        .setTitle(`Ruokalista - ${ss.title}`);
    return embed;
};

export const createAttachment = (fileloc: string, filename?: string) => {
    if (!fs.existsSync(fileloc)) {
        return undefined;
    }

    return new AttachmentBuilder(fileloc).setFile(filename);
};
