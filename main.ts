import { Client, Message } from "discord.js";
import { DiscordClient } from "./types";

/* require */
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import { intents } from "./intents";
const client: DiscordClient = new Client({ intents: intents }) as DiscordClient;
import { REST } from "@discordjs/rest";
const token = process.env.TOKEN;
import {
    requireCommands,
    executeCommand,
    rotateSisterActivities,
    registerSlashCommands,
} from "./util";

/* stuff */
const prefix = "sir ";
const environment = process.env.ENVIRONMENT;

/* Bot setup */
client.once("ready", () => {
    console.log("I am ready");
    client.user.setPresence({
        activities: [{ name: "My sister", type: "WATCHING" }],
        status: "online",
    });
    rotateSisterActivities(client);
});

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
const initialize = async () => {
    await client.login(token);
    const rest = new REST({ version: "9" }).setToken(token);
    client.commands = await requireCommands("commands");
    client.interactions = await requireCommands("interactions");
    client.slashCommands = await requireCommands("slash-commands");
    registerSlashCommands(client);
    console.log(`Running in ${environment} mode`);
};

initialize();
