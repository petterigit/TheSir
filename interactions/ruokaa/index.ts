import {
    ButtonInteraction,
    Collection,
    EmbedField,
    MessageEmbed,
} from "discord.js";

const Discord = require("discord.js");
const { createMention } = require("../../util");

const idToRestaurant = {
    yolo: "Yolo",
    laser: "Laser",
    buffet: "LUT Buffet",
    skip: "Skip",
};

const participantSeparator = "\n";

const ruokaa = async (interaction: ButtonInteraction) => {
    if (!interaction.isButton()) return;
    const restaurantParameter = interaction.customId.split(" ")[1];

    const originalEmbed = interaction.message.embeds[0];
    let participantEmbed = interaction.message.embeds[1] as MessageEmbed;
    if (!participantEmbed) {
        participantEmbed = createParticipantEmbed(
            idToRestaurant[restaurantParameter],
            createMention(interaction)
        );
        participantEmbed.setColor(originalEmbed.color);
    } else {
        const votes = parseParticipants(participantEmbed);
        const newVotes = setVote(
            votes,
            idToRestaurant[restaurantParameter],
            createMention(interaction)
        );
        const newFields = setVotesToFields(newVotes);
        participantEmbed.setFields(newFields);
    }

    interaction.update({
        embeds: [originalEmbed, participantEmbed],
    });
};

const createParticipantEmbed = (restaurant: string, participant: string) => {
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Ruokailijat");
    embed.addField(restaurant, participant, true);
    return embed;
};

const parseParticipants = (
    embed: MessageEmbed
): Collection<string, string[]> => {
    const collection = new Collection<string, string[]>();
    embed.fields.forEach((field) => {
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
    const userIndex = votes[restaurant]?.findIndex(
        (vote: string) => vote === participant
    );
    if (userIndex >= 0) {
        votes[restaurant].splice(userIndex, 1);
        return votes;
    }
    console.log("coming votes");
    console.log(votes);

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
    console.log("going votes");
    console.log(filteredVotes);
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
    console.log("all fields: ");
    console.log(fields);

    const sortedFields = fields
        .filter((field) => field.value)
        .sort((a, b) => {
            const aName = removeParticipantCount(a.name);
            const bName = removeParticipantCount(b.name);
            const skipName = idToRestaurant["skip"];
            if (aName === bName) return 0;
            if (aName === skipName) return 1;
            if (bName === skipName) return -1;
            return aName > bName ? 1 : -1;
        });
    console.log("sorted fields: ");
    console.log(sortedFields);
    return sortedFields;
};

const addParticipantCount = (name: string, count: number) => {
    return name + ` (${count})`;
};

const removeParticipantCount = (name: string) => {
    const restaurant = name.split(" ")[0];
    return restaurant;
};

module.exports = {
    data: {
        name: "ruokaa",
    },
    async execute(interaction: ButtonInteraction) {
        await ruokaa(interaction);
    },
};
