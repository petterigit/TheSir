import { MessageEmbed } from "discord.js";

export const createKeskustaEmbed = () => {
    const embed = new MessageEmbed()
        .setTitle(`Keskusta`)
        .setDescription(
            "Ruokaa mm. Rosson, Luckiesin, ja Lalon tarjoilemana :]"
        );

    return embed;
};
