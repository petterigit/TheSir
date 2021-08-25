const Discord = require("discord.js");
const { createMention } = require("../../util.js");

const idToRestaurant = {
    yolo: "Yolo",
    laser: "Laser",
    buffet: "LUT Buffet",
    skip: "Skip",
};

const participantSeparator = "\n";

const ruokaa = async (interaction) => {
    if (!interaction.isButton()) return;
    const restaurantParameter = interaction.customId.split(" ")[1];

    const originalEmbed = interaction.message.embeds[0];
    let participantEmbed = interaction.message.embeds[1];
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

const createParticipantEmbed = (restaurant, participant) => {
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Ruokailijat");
    embed.addField(restaurant, participant, true);
    return embed;
};

const parseParticipants = (embed) => {
    return embed.fields.reduce((votes, field) => {
        const participants = field.value.split(participantSeparator);
        const fieldName = removeParticipantCount(field.name);
        votes[fieldName] = participants;
        return votes;
    }, {});
};

const setVote = (votes, restaurant, participant) => {
    // User didn't change their vote, return early
    if (votes[restaurant]?.includes(participant)) return votes;

    const filteredVotes = {};
    for (const [key, value] of Object.entries(votes)) {
        const newParticipants = value.filter(
            (participantName) => participantName !== participant
        );
        filteredVotes[key] = newParticipants;
    }

    if (filteredVotes[restaurant] == null) {
        filteredVotes[restaurant] = [participant];
    } else {
        filteredVotes[restaurant].push(participant);
    }
    return filteredVotes;
};

const setVotesToFields = (votes) => {
    const fields = Object.entries(votes).map(([key, value]) => {
        const field = {
            name: key,
            value: value?.join(participantSeparator),
            inline: true,
        };
        if (value.length > 1) {
            field.name = addParticipantCount(key, value);
        }
        return field;
    });

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
    return sortedFields;
};

const addParticipantCount = (name, participants) => {
    name += ` (${participants.length})`;
    return name;
};

const removeParticipantCount = (name) => {
    const restaurant = name.split(" ")[0];
    return restaurant;
};

module.exports = {
    data: {
        name: "ruokaa",
    },
    async execute(interaction) {
        await ruokaa(interaction);
    },
};
