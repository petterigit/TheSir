import {
    ApplicationCommandOptionData,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChatInputCommandInteraction,
    EmbedBuilder,
} from "discord.js";
import * as data from "./shrek.json";
import join from "lodash/join";
import find from "lodash/find";
import map from "lodash/map";
import sample from "lodash/sample";
import { SlashCommandModule } from "../../types";
import _ from "lodash";
import { DISCORD_NUMBER_OF_CHOICES } from "../../util";

interface Character {
    speaker: string;
    lines: string[];
}

const askShrek = async (interaction: ChatInputCommandInteraction) => {
    try {
        await interaction.deferReply();
        getLinesAndSendOneToDiscord(interaction);
    } catch (error) {
        interaction.editReply(
            "Get out of my Swamp!!\n (Something went wrong...)"
        );
        console.log(error);
    }
};

function getLinesAndSendOneToDiscord(interaction: ChatInputCommandInteraction) {
    const characterChoice = getCharacterChoice(interaction);

    const characters: Character[] = data.speakers;
    const character = find(
        characters,
        (o) => o.speaker.toLowerCase() === characterChoice
    );

    if (!character) {
        sendCharacterNotFound(interaction, characterChoice);
        return;
    }

    sendAnswerToDiscord(interaction, character);
}

const getInputs = (): ApplicationCommandOptionData[] => {
    const chunks = _.chunk(data.speakers, DISCORD_NUMBER_OF_CHOICES);
    return chunks.map(
        (chunk, index): ApplicationCommandOptionData => ({
            type: ApplicationCommandOptionType.String,
            name: `character-${index + 1}`,
            choices: chunk.map((o) => ({
                name: o.speaker,
                value: o.speaker,
            })),
            description: "Ask from characters",
        })
    );
};

const getCharacterChoice = (interaction: ChatInputCommandInteraction) => {
    const inputs = getInputs();
    for (const input of inputs) {
        const value = interaction.options.getString(input.name);
        if (value) {
            return value;
        }
    }
};

function sendCharacterNotFound(
    interaction: ChatInputCommandInteraction,
    name: string | null = null
) {
    const embed = new EmbedBuilder();
    if (name) {
        embed.setTitle("Could not find character with name: " + name);
    } else {
        embed.setTitle("No character name was given");
    }

    const allSpeakers: Character[] = data.speakers;
    const speakers = join(map(allSpeakers, "speaker"), ", ");
    embed.setColor("#ff0000").addFields({
        name: "usage: select some character as a parameter",
        value: "available characters:\n" + speakers,
    });

    interaction.editReply({ embeds: [embed] });
}

function sendAnswerToDiscord(
    interaction: ChatInputCommandInteraction,
    answer: Character
) {
    const embed = new EmbedBuilder();
    embed.setTitle(answer.speaker + " answered:");
    embed.setDescription(sample(answer.lines));
    interaction.editReply({ embeds: [embed] });
}

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: ["ask"],
        description: "Ask for advice from the most beloved ogre",
        options: getInputs(),
    },
    async execute(interaction: ChatInputCommandInteraction) {
        await askShrek(interaction);
    },
};

export default command;
