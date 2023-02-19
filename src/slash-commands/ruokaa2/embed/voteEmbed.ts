import { MessageEmbed } from "discord.js";
import { randomColor } from "../../../util";

export const createVoteEmbed = async () => {
    const voteEmbed = new MessageEmbed();
    voteEmbed.setTitle("Äänestä ruokapaikkaa");
    voteEmbed.setColor(randomColor());

    return voteEmbed;
};
