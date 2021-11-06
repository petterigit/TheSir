import { Message } from "discord.js";
import { DiscordClient } from "./types";

/* require */
require("dotenv").config();
const { intents } = require("./intents.js");
const Discord = require("discord.js");
const client: DiscordClient = new Discord.Client({ intents: intents });
const { REST } = require("@discordjs/rest");
const token = process.env.TOKEN;
const {
    requireCommands,
    executeCommand,
    rotateSisterActivities,
    registerSlashCommands,
} = require("./util");

/* stuff */
const prefix = "sir ";
const environment = process.env.ENVIRONMENT;
console.log(`Running in ${environment} mode`);

const rest = new REST({ version: "9" }).setToken(token);
/* Bot setup */
client.once("ready", () => {
    console.log("I am ready");
    client.user.setPresence({
        activities: [{ name: "My sister", type: "WATCHING" }],
        status: "online",
    });
    rotateSisterActivities(client);
});

client.commands = requireCommands("commands");
client.interactions = requireCommands("interactions");
client.slashCommands = requireCommands("slash-commands");
console.log(client.interactions);
console.log(client.slashCommands);

registerSlashCommands(client.slashCommands, rest);

/* Handle messages */
client.on("messageCreate", async (message: Message) => {
    if (!message.content.startsWith(prefix)) return;
    let args = message.content.substring(1).split(" ");
    const cmd = args[1];

    args = args.splice(1);

    const commandHandler = client.commands.get(cmd);
    executeCommand(message, commandHandler, client);
});

/* Handle interactions */
client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        const interactionHandler = client.slashCommands.get(
            interaction.commandName
        );
        executeCommand(interaction, interactionHandler, client);
    } else if (interaction.isButton()) {
        const interactionId = interaction.customId?.split(" ")[0];
        const interactionHandler = client.interactions.get(interactionId);
        executeCommand(interaction, interactionHandler, client);
    }
});

client.login(token);
