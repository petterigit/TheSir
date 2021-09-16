const { createMention } = require("../../util");

const NAME_SEPARATOR = ", ";

const poll = (interaction) => {
    const buttonParts = interaction.customId.split(" ");
    const buttonText = buttonParts.slice(2).join(" ");
    const user = createMention(interaction);

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
    const fields = removeAnswerCounts(embed.fields);
    const selectedField = getSelectedField(fields, buttonText);

    let newFields = [];
    if (!selectedField) {
        const newField = createNewField(buttonText, user);
        newFields = [...fields, newField];
    } else {
        const users = parseUsersFromField(selectedField);
        const newUsers = addOrRemoveUser(users, user);
        if (newUsers.length === 0) {
            newFields = removeEmptyField(fields, buttonText);
        } else {
            newFields = updateField(fields, buttonText, newUsers);
        }
    }

    const formattedFields = addAnswerCounts(newFields);
    const sortedFields = formattedFields.sort(fieldComparator);
    return { ...embed, fields: sortedFields };
};

const removeAnswerCounts = (fields) => {
    return fields.map((field) => {
        if (field.value === "") return field;
        const fieldParts = field.name.split(" ");
        const name = fieldParts.slice(0, -1).join(" ");
        return { ...field, name: name };
    });
};

const addAnswerCounts = (fields) =>
    fields.map((field) => {
        field.name = `${field.name} (${
            field.value.split(NAME_SEPARATOR).length
        })`;
        return field;
    });

const getSelectedField = (fields, name) =>
    fields.find((field) => field.name === name);

const updateField = (fields, buttonText, users) => {
    const value = formatUsersToField(users);
    const updatedField = createNewField(buttonText, value);
    return fields.map((field) =>
        field.name === buttonText ? updatedField : field
    );
};

const removeEmptyField = (fields, buttonText) => {
    return fields.filter((field) => field.name !== buttonText);
};

const addOrRemoveUser = (users, user) => {
    const userIndex = users.indexOf(user);
    if (userIndex >= 0) {
        users.splice(userIndex, 1);
        return users;
    } else {
        return [...users, user];
    }
};

const createNewField = (buttonText, user) => ({
    name: buttonText,
    value: user,
});

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
