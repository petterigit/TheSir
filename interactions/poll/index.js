const poll = (interaction) => {
    const buttonId = interaction.customId.split(" ")[1];
    interaction.reply(`Pressed button ${buttonId}`);
};

module.exports = {
    data: {
        name: "poll",
    },
    async execute(interaction) {
        await poll(interaction);
    },
};
