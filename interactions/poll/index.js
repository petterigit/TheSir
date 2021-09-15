const { constants } = require("../../slash-commands/poll");
const { createMention } = require("../../util");

const poll = (interaction) => {
    const buttonParts = interaction.customId.split(" ");
    const buttonText = buttonParts
        .slice(1)
        .join(" ")
        .replace(constants.optionPrefix, "");
    const user = createMention(interaction);

    let embed = {};
    if (buttonText === constants.optionRemove) {
    } else {
        embed = handleVote(interaction, buttonText, user);
    }

    interaction.update({
        embeds: [embed],
    });
};

const handleVote = (interaction, buttonText, user) => {
    const pollEmbed = interaction.message.embeds[0];
    return setVote(pollEmbed, buttonText, user);
};

const setVote = (embed, buttonText, user) => {
    const selectedField = embed.fields.find(
        (field) => field.name === buttonText
    );
    if (!selectedField) {
        const newField = {
            name: buttonText,
            value: user,
        };
        embed.fields.push(newField);
    } else {
        const users = parseUsersFromField(selectedField);
        const userIndex = users.indexOf(user);
        if (userIndex >= 0) {
            users.splice(userIndex, 1);
        } else {
            users.push(user);
        }
        if (users.length === 0) {
            const newEmbed = embed.fields.filter(
                (field) => field.name !== buttonText
            );
            return newEmbed;
        } else {
            selectedField.value = formatUsersToField(users);
            const newEmbed = embed.fields.map((field) =>
                field.name === buttonText ? selectedField : field
            );
            return newEmbed;
        }
    }

    return embed;
};

const getTitleFromInteraction = (interaction) => {
    const message = interaction.message.content;
    const messageQuote = message.split("\n")[1];
    const title = messageQuote.replace("> ", "");
    return title;
};

const parseUsersFromField = (field) => field.value.split(" ");
const formatUsersToField = (users) => users.join(" ");

module.exports = {
    data: {
        name: "poll",
    },
    async execute(interaction) {
        await poll(interaction);
    },
};
