const { MessageActionRow, MessageButton } = require("discord.js");
const { getNicknameOrName, ButtonTypes } = require("../../util");

// Max 5 buttons per row, max 5 rows
// -1 for question
// -1 for remove vote button
const MAX_BUTTONS = 23;
const MAX_BUTTONS_PER_ROW = 5;
const COMMAND_NAME = "poll";

const poll = (interaction) => {
    const buttons = createButtons(interaction);
    const actionRows = createActionRows(buttons);

    const title = interaction.options.getString("title");

    interaction.reply({
        content: `${getNicknameOrName(
            interaction
        )} started a poll!\n> ${title}`,
        components: actionRows,
    });
};

const createActionRows = (buttons) => {
    const actionRows = [];
    for (
        let i = 0, limit = buttons.length;
        i < limit;
        i += MAX_BUTTONS_PER_ROW
    ) {
        const actionRow = new MessageActionRow();
        const row = buttons.slice(i, i + MAX_BUTTONS_PER_ROW);
        row.map((button) => actionRow.addComponents(button));
        actionRows.push(actionRow);
    }
    return actionRows;
};

const createButtons = (interaction) => {
    const indexes = Array(MAX_BUTTONS)
        .fill(0)
        .map((_, i) => i);

    const inputs = indexes.reduce((inputs, i) => {
        const input = interaction.options.getString(optionName(i));
        if (input)
            inputs.push({
                id: optionName(inputs.length + 1),
                name: input,
            });
        return inputs;
    }, []);

    const buttons = inputs.map((input) => createButton(input.id, input.name));
    buttons.push(createButton("remove", "Poista", ButtonTypes.Secondary));
    return buttons;
};

const createButton = (id, text, style = ButtonTypes.Primary) => {
    return new MessageButton({
        customId: `${COMMAND_NAME} ${id}`,
        label: text,
        style: style,
    });
};

const optionName = (index) => `option-${index + 1}`;

const createInputs = (numberOfInputs) => {
    const inputs = Array(numberOfInputs)
        .fill(0)
        .map((_, i) => ({
            type: 3,
            name: optionName(i),
            description: `${i + 1}. option`,
            required: i === 0,
        }));
    inputs.unshift({
        type: 3,
        name: "title",
        description: "The title of the poll",
        required: true,
    });
    return inputs;
};

module.exports = {
    data: {
        type: 1,
        name: COMMAND_NAME,
        description: "Create polls with your friends!",
        options: createInputs(MAX_BUTTONS),
    },
    async execute(interaction) {
        await poll(interaction);
    },
};
