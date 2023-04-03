import {
    ButtonInteraction,
    Collection,
    EmbedField,
    EmbedBuilder,
} from "discord.js";
import { createMention } from "../util";
const participantSeparator = "\n";

const voteTitle = "Äänestä ruokapaikkaa";

export const ruokaaInteraction = async (interaction: ButtonInteraction) => {
    if (!interaction.isButton()) return;

    const restaurantParameter = interaction.customId.split(" ")[1];

    console.log("ruokaa interaction param: ", restaurantParameter);

    const messageEmbeds = interaction.message.embeds;

    const participantEmbed = EmbedBuilder.from(
        messageEmbeds.find((embed) => embed.title === voteTitle)
    );

    if (!participantEmbed) {
        const participantEmbed = createParticipantEmbed(
            restaurantParameter,
            createMention(interaction)
        );
        interaction.update({
            embeds: [participantEmbed],
        });
        return;
    }

    const votes = parseParticipants(participantEmbed);

    const newVotes = setVote(
        votes,
        restaurantParameter,
        createMention(interaction)
    );
    const newFields = setVotesToFields(newVotes);
    participantEmbed.setFields(newFields);

    interaction.update({
        embeds: [participantEmbed],
    });
};

export const createEmptyVotingEmbed = () => {
    const embed = new EmbedBuilder();
    embed.setTitle(voteTitle);
    embed.setColor(11342935);
    return embed;
};

const createParticipantEmbed = (restaurant: string, participant: string) => {
    const embed = new EmbedBuilder();
    embed.setTitle(voteTitle);
    embed.addFields({ name: restaurant, value: participant, inline: true });
    embed.setColor(11342935);
    return embed;
};

const parseParticipants = (
    embed: EmbedBuilder
): Collection<string, string[]> => {
    const collection = new Collection<string, string[]>();
    embed.data.fields.forEach((field) => {
        const participants = field.value.split(participantSeparator);
        const fieldName = removeParticipantCount(field.name);
        collection.set(fieldName, participants);
    }, {});
    return collection;
};

const setVote = (
    votes: Collection<string, string[]>,
    restaurant: string,
    participant: string
) => {
    const userIndex = votes
        .get(restaurant)
        ?.findIndex((vote: string) => vote === participant);
    if (userIndex >= 0) {
        votes.get(restaurant).splice(userIndex, 1);
        return votes;
    }

    const filteredVotes = new Collection<string, string[]>();
    votes.forEach((value, key) => {
        const newParticipants = value.filter(
            (participantName: string) => participantName !== participant
        );
        filteredVotes.set(key, newParticipants);
    });

    if (filteredVotes.get(restaurant) == null) {
        filteredVotes.set(restaurant, [participant]);
    } else {
        filteredVotes.get(restaurant).push(participant);
    }
    return filteredVotes;
};

const setVotesToFields = (votes: Collection<string, string[]>) => {
    const fields: EmbedField[] = [];
    votes.forEach((value, key) => {
        const field = {
            name: key,
            value: value?.join(participantSeparator),
            inline: true,
        };
        if (value.length > 1) {
            field.name = addParticipantCount(key, value.length);
        }
        fields.push(field);
    });

    const sortedFields = fields
        .filter((field) => field.value)
        .sort((a, b) => {
            const aName = removeParticipantCount(a.name);
            const bName = removeParticipantCount(b.name);
            const skipName = "Skip";
            if (aName === bName) return 0;
            if (aName === skipName) return 1;
            if (bName === skipName) return -1;
            return aName > bName ? 1 : -1;
        });
    return sortedFields;
};

const addParticipantCount = (name: string, count: number) => {
    return name + ` (${count})`;
};

const removeParticipantCount = (name: string) => {
    const indexOfOpenParenthesis = name.lastIndexOf("(");
    if (indexOfOpenParenthesis !== -1) {
        return name.substring(0, indexOfOpenParenthesis).trim();
    }
    return name;
};
