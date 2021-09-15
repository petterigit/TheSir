const { createMention, getNicknameOrName } = require("../../util");

const NAME_SEPARATOR = ", ";

const poll = (interaction) => {
    const buttonParts = interaction.customId.split(" ");
    const buttonIndex = parseInt(buttonParts[1]);
    const buttonText = buttonParts.slice(2).join(" ");
    const user = getNicknameOrName(interaction);

    const embed = handleVote(interaction, buttonText, user);

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
            const newFields = embed.fields.filter(
                (field) => field.name !== buttonText
            );
            const sortedFields = newFields.sort(fieldComparator);
            return { ...embed, fields: sortedFields };
        } else {
            selectedField.value = formatUsersToField(users);
            const newFields = embed.fields.map((field) =>
                field.name === buttonText ? selectedField : field
            );
            const sortedFields = newFields.sort(fieldComparator);
            return { ...embed, fields: sortedFields };
        }
    }

    const sortedFields = embed.fields.sort(fieldComparator);
    return { ...embed, fields: sortedFields };
};

const fieldComparator = (a, b) => {
    const votesA = a.value?.split(NAME_SEPARATOR).length ?? 0;
    const votesB = b.value?.split(NAME_SEPARATOR).length ?? 0;

    if (votesA === votesB) {
        return a.name > b.name ? 1 : -1;
    }
    return votesA > votesB ? -1 : 1;
};

const parseUsersFromField = (field) => field.value.split(NAME_SEPARATOR);
const formatUsersToField = (users) => users.join(NAME_SEPARATOR);

module.exports = {
    data: {
        name: "poll",
    },
    async execute(interaction) {
        await poll(interaction);
    },
};
