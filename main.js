/* require */
require("dotenv").config();
const { intents } = require("./intents.js");
const Discord = require("discord.js");
const client = new Discord.Client({ intents: intents });
const token = process.env.TOKEN;
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { requireCommands } = require("./util.js");

/* stuff */
const prefix = "sir ";

/* Bot setup */
client.once("ready", () => {
    console.log("I am ready");
    client.user.setActivity("Fucking", { type: "my sister" });
});

client.commands = requireCommands("commands");
client.interactions = requireCommands("interactions");
client.slashCommands = requireCommands("slash-commands");

/* Handle messages */
client.on("messageCreate", async (message) => {
    if (!message.content.startsWith(prefix)) return;
    let args = message.content.substring(1).split(" ");
    let cmd = args[1];

    args = args.splice(1);

    const command = client.commands.get(cmd);
    if (!command) {
        return;
    }

    try {
        await command.execute(message, client);
    } catch (error) {
        console.error(error);
        await message.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
});

/* Handle interactions */
client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        const interactionHandler = client.slashCommands.get(
            interaction.commandName
        );
        if (!interactionHandler) return;

        try {
            await interactionHandler.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await message.reply({
                content:
                    "There was an error while executing this slash command!",
                ephemeral: true,
            });
        }
    } else if (interaction.isButton()) {
        const interactionId = interaction.customId?.split(" ")[0];
        const interactionHandler = client.interactions.get(interactionId);
        if (!interactionHandler) return;

        try {
            await interactionHandler.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await message.reply({
                content:
                    "There was an error while executing this button interaction!",
                ephemeral: true,
            });
        }
    }
});

/* Register slash commands */
const rest = new REST({ version: "9" }).setToken(token);
const commandsToRegister = client.slashCommands.map((slash) =>
    slash.data.toJSON()
);
const registerSlashCommands = async () => {
    const clientId = process.env.CLIENT_ID;
    const guildId = process.env.GUILD_ID;
    try {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commandsToRegister,
        });
        console.log("Registered application commands");
    } catch (error) {
        console.error("Failed to register application commands", error);
    }
};
registerSlashCommands();
client.login(token);
