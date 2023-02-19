import { MessageEmbed } from "discord.js";

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
