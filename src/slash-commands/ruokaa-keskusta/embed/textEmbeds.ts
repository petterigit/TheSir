import { EmbedBuilder } from "discord.js";

export const createTextEmbeds = () => {
    const lalo = new EmbedBuilder()
        .setTitle(`Lalo`)
        .setDescription("Burgeria. Nam!");

    const luckies = new EmbedBuilder()
        .setTitle(`Luckie's`)
        .setDescription("Sushia. Nam!");

    return [lalo, luckies];
};
