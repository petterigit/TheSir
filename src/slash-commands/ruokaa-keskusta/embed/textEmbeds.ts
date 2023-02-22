import { MessageEmbed } from "discord.js";

export const createTextEmbeds = () => {
    const lalo = new MessageEmbed()
        .setTitle(`Lalo`)
        .setDescription("Burgeria. Nam!");

    const luckies = new MessageEmbed()
        .setTitle(`Luckie's`)
        .setDescription("Sushia. Nam!");

    return [lalo, luckies];
};
