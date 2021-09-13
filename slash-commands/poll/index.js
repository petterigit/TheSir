const { SlashCommandBuilder } = require("@discordjs/builders");

const poll = (interaction) => {
    const input = interaction.options.getString("input");
    interaction.reply(`You sent: ${input}`);
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Create polls with your friends!")
        .addStringOption((option) =>
            option
                .setName("input")
                .setDescription("The input the echo back")
                .setRequired(true)
        ),
    async execute(interaction) {
        await poll(interaction);
    },
};
