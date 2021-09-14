// Max 5 buttons per row, max 5 rows, -1 for remove vote button
const MAX_BUTTONS = 24;

const poll = (interaction) => {
    const input = interaction.options.getString("input");
    interaction.reply(`You sent: ${input}`);
};

const createInputs = (numberOfInputs) => {
    return Array(numberOfInputs)
        .fill(0)
        .map((_, i) => ({
            type: 3,
            name: `option-${i + 1}`,
            description: `${i + 1}. option`,
            required: i === 0,
        }));
};

module.exports = {
    data: {
        type: 1,
        name: "poll",
        description: "Create polls with your friends!",
        options: createInputs(MAX_BUTTONS),
    },
    async execute(interaction) {
        await poll(interaction);
    },
};
