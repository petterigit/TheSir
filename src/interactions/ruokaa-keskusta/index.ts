import {
    ButtonInteraction,
    Collection,
    EmbedField,
    MessageAttachment,
    MessageEmbed,
} from "discord.js";
import { InteractionModule } from "../../types";

import { createMention } from "../../util";

const participantSeparator = "\n";

const voteTitle = "Äänestä ruokapaikkaa";

const ruokaa = async (interaction: ButtonInteraction) => {
    if (!interaction.isButton()) return;

    const restaurantParameter = interaction.customId.split(" ")[1];

    console.log("ruokaa-keskusta interaction param: ", restaurantParameter);

    const messageAttachments = interaction.message.attachments as Collection<
        string,
        MessageAttachment
    >;
    const messageAttachmentArray = Array.from(messageAttachments.values());

    const messageEmbeds = interaction.message.embeds;

    const participantEmbed = (messageEmbeds as MessageEmbed[]).find(
        (embed) => embed.title === voteTitle
    );

    if (!participantEmbed) {
        const freshParticipantEmbed = createParticipantEmbed(
            restaurantParameter,
            createMention(interaction)
        );

        interaction.update({
            embeds: [...messageEmbeds, freshParticipantEmbed],
            attachments: messageAttachmentArray,
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
        embeds: messageEmbeds,
        attachments: messageAttachmentArray,
    });
};

const createParticipantEmbed = (restaurant: string, participant: string) => {
    const embed = new MessageEmbed();
    embed.setTitle(voteTitle);
    embed.addField(restaurant, participant, true);
    embed.setColor(11342935);
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

const interaction: InteractionModule = {
    data: {
        name: "ruokaa-keskusta",
    },
    async execute(interaction: ButtonInteraction) {
        await ruokaa(interaction);
    },
};

export default interaction;
