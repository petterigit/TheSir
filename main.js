/* require */
require("dotenv").config();
const { intents } = require("./intents.js");
const Discord = require("discord.js");
const client = new Discord.Client({ intents: intents });
const token = process.env.TOKEN;
const fs = require("fs");

/* stuff */
const prefix = "sir ";

/* Bot setup */
client.once("ready", () => {
  console.log("I am ready");
  client.user.setActivity("Fucking", { type: "my sister" });
});

/* Require all commands from the commands folder */
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands/");
for (const dir of commandFiles) {
  const command = require(`./commands/${dir}`);
  if (command?.data?.name) {
    if (Array.isArray(command.data.name)) {
      command.data.name.map((name) =>
        client.commands.set(name.toLowerCase(), command)
      );
    } else {
      client.commands.set(command.data.name.toLowerCase(), command);
    }
  }
}

/* Require all interactions from the interactions folder */
client.interactions = new Discord.Collection();
const interactionFiles = fs.readdirSync("./interactions/");
for (const dir of interactionFiles) {
  const interaction = require(`./interactions/${dir}`);
  if (interaction?.data?.name) {
    if (Array.isArray(interaction.data.name)) {
      interaction.data.name.map((name) =>
        client.interactions.set(name, interaction)
      );
    } else {
      client.interactions.set(interaction.data.name, interaction);
    }
  }
}

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
  const interactionHandler = client.interactions.get(interaction.customId);
  if (!interactionHandler) {
    return;
  }

  try {
    await interactionHandler.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await message.reply({
      content: "There was an error while executing this interaction!",
      ephemeral: true,
    });
  }
});

client.login(token);
