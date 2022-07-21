import { APIEmbedField } from "discord-api-types/v9";
import {
    ButtonInteraction,
    EmbedField,
    InteractionUpdateOptions,
    MessageEmbed,
    MessageEmbedOptions,
} from "discord.js";
import { InteractionModule as InteractionModule } from "../../types";

import { createMention } from "../../util";

const NAME_SEPARATOR = ", ";

const poll = async (interaction: ButtonInteraction) => {
    const buttonParts = interaction.customId.split(" ");
    const buttonText = buttonParts.slice(2).join(" ");
    const user = createMention(interaction);

    const embed = handleVote(interaction, buttonText, user);
    const options: InteractionUpdateOptions = {
        embeds: [embed],
    };

    interaction.update(options);
};

const handleVote = (
    interaction: ButtonInteraction,
    buttonText: string,
    user: string
) => {
    const pollEmbed = interaction.message.embeds[0] as MessageEmbed;
    return setVote(pollEmbed, buttonText, user);
};

const setVote = (
    embed: MessageEmbed,
    buttonText: string,
    user: string
): MessageEmbedOptions => {
    const fields = removeAnswerCounts(embed.fields);
    const selectedField = getSelectedField(fields, buttonText);

    let newFields: EmbedField[] | APIEmbedField[] = [];
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
    const sortedFields: EmbedField[] = formattedFields.sort(
        fieldComparator
    ) as EmbedField[];
    return new MessageEmbed({ ...embed, fields: sortedFields });
};

const removeAnswerCounts = (
    fields: EmbedField[] | APIEmbedField[]
): EmbedField[] | APIEmbedField[] => {
    return fields.map((field: EmbedField | APIEmbedField) => {
        if (field.value === "") return field;
        const fieldParts = field.name.split(" ");
        const name = fieldParts.slice(0, -1).join(" ");
        return { ...field, name: name };
    });
};

const addAnswerCounts = (
    fields: EmbedField[] | APIEmbedField[]
): EmbedField[] | APIEmbedField[] =>
    fields.map((field: EmbedField | APIEmbedField) => {
        field.name = `${field.name} (${
            field.value.split(NAME_SEPARATOR).length
        })`;
        return field;
    });

const getSelectedField = (
    fields: EmbedField[] | APIEmbedField[],
    name: string
): EmbedField | APIEmbedField =>
    fields.find((field: EmbedField | APIEmbedField) => field.name === name);

const updateField = (
    fields: EmbedField[] | APIEmbedField[],
    buttonText: string,
    users: string[]
): EmbedField[] | APIEmbedField[] => {
    const value = formatUsersToField(users);
    const updatedField = createNewField(buttonText, value);
    return fields.map((field: EmbedField | APIEmbedField) =>
        field.name === buttonText ? updatedField : field
    );
};

const removeEmptyField = (
    fields: EmbedField[] | APIEmbedField[],
    buttonText: string
) => {
    return fields.filter((field) => field.name !== buttonText);
};

const addOrRemoveUser = (users: string[], user: string) => {
    const userIndex = users.indexOf(user);
    if (userIndex >= 0) {
        users.splice(userIndex, 1);
        return users;
    } else {
        return [...users, user];
    }
};

const createNewField = (
    buttonText: string,
    user: string,
    inline = false
): EmbedField => ({
    name: buttonText,
    value: user,
    inline,
});

const fieldComparator = (
    a: EmbedField | APIEmbedField,
    b: EmbedField | APIEmbedField
) => {
    const votesA = a.value?.split(NAME_SEPARATOR).length ?? 0;
    const votesB = b.value?.split(NAME_SEPARATOR).length ?? 0;

    if (votesA === votesB) {
        return a.name > b.name ? 1 : -1;
    }
    return votesA > votesB ? -1 : 1;
};

const parseUsersFromField = (field: EmbedField | APIEmbedField) =>
    field.value.split(NAME_SEPARATOR);
const formatUsersToField = (users: string[]) => users.join(NAME_SEPARATOR);

const interaction: InteractionModule = {
    data: {
        name: "poll",
    },
    async execute(interaction: ButtonInteraction) {
        await poll(interaction);
    },
};

export default interaction;
