import { Message, MessageEmbed } from "discord.js";
import _ = require("lodash");

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
    let args = message.content.substring(1).split(" ");
    if (args.length < 3) {
        sendCharacterNotFound(message);
        return;
    }

    let characterName = _.join(args.slice(2), " ").toLowerCase();

    const fs = require("fs");
    const path = require("path");
    const file = fs.readFileSync(path.join(__dirname, "./shrek.json"));

    const characters: Character[] = JSON.parse(file).speakers;
    const character = _.find(
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

    const fs = require("fs");
    const path = require("path");
    const file = fs.readFileSync(path.join(__dirname, "./shrek.json"));
    const allSpeakers: Character[] = JSON.parse(file).speakers;
    const speakers = _.join(_.map(allSpeakers, "speaker"), ", ");
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
    embed.setDescription(_.sample(answer.lines));
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
