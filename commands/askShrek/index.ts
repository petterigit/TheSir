import { Message, MessageEmbed } from "discord.js";
import * as data from "./shrek.json";
import join from "lodash/join";
import find from "lodash/find";
import map from "lodash/map";
import sample from "lodash/sample";

interface Character {
    speaker: string;
    lines: string[];
}

const askShrek = async (message: Message) => {
    try {
        getLinesAndSendOneToDiscord(message);
    } catch (error) {
        message.channel.send(
            "Get out of my Swamp!!\n (Something went wrong...)"
        );
        console.log(error);
    }
};

function getLinesAndSendOneToDiscord(message: Message) {
    const args = message.content.substring(1).split(" ");
    if (args.length < 3) {
        sendCharacterNotFound(message);
        return;
    }

    const characterName = join(args.slice(2), " ").toLowerCase();

    const characters: Character[] = data.speakers;
    const character = find(
        characters,
        (o) => o.speaker.toLowerCase() === characterName
    );

    if (!character) {
        sendCharacterNotFound(message, characterName);
        return;
    }

    sendAnswerToDiscord(message, character);
}

function sendCharacterNotFound(message: Message, name: string | null = null) {
    const embed = new MessageEmbed();
    if (name) {
        embed.setTitle("Could not find character with name: " + name);
    } else {
        embed.setTitle("No character name was given");
    }

    const allSpeakers: Character[] = data.speakers;
    const speakers = join(map(allSpeakers, "speaker"), ", ");
    embed
        .setColor("#ff0000")
        .addField(
            "usage: sir ask <character>",
            "available characters:\n" + speakers
        );

    message.channel.send({ embeds: [embed] });
}

function sendAnswerToDiscord(message: Message, answer: Character) {
    const embed = new MessageEmbed();
    embed.setTitle(answer.speaker + " answered:");
    embed.setDescription(sample(answer.lines));
    message.channel.send({ embeds: [embed] });
}

module.exports = {
    data: {
        name: ["ask", "askShrek"],
        description: "Ask for advice from the most beloved ogre",
    },
    async execute(message: Message) {
        await askShrek(message);
    },
};
