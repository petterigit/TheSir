const { randomInt } = require("crypto");
const Discord = require("discord.js");
const fs = require("fs");
const { Routes } = require("discord-api-types/v9");

exports.getNicknameOrName = (message) => {
    if (message.member.nickname == null) {
        return message.member.user.username;
    }
    return message.member.nickname;
};

exports.createMention = (interaction) => {
    return `<@${interaction.member.id}>`;
};

exports.ButtonTypes = {
    Primary: "PRIMARY",
    Secondary: "SECONDARY",
    Success: "SUCCESS",
    Danger: "DANGER",
    Link: "LINK",
};

exports.RandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

exports.randomColor = () => {
    let color = "#";
    for (let i = 0; i < 3; i++) {
        color += randomInt(0, 255).toString(16);
    }
    return color;
};

exports.requireCommands = (folderName) => {
    const commands = new Discord.Collection();
    const folders = fs.readdirSync(`./${folderName}/`);

    for (const folder of folders) {
        const command = require(`./${folderName}/${folder}`);
        if (command?.data?.name) {
            if (Array.isArray(command.data.name)) {
                command.data.name.map((name) => commands.set(name, command));
            } else {
                commands.set(command.data.name, command);
            }
        }
    }

    return commands;
};

exports.executeCommand = async (interaction, handler, client) => {
    if (!handler) return;

    try {
        await handler.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this interaction!",
            ephemeral: true,
        });
    }
};

exports.registerSlashCommands = async (commands, rest) => {
    const clientId = process.env.CLIENT_ID;
    const guildId = process.env.GUILD_ID;

    const commandsToRegister = commands.map((slash) =>
        slash.data.toJSON ? slash.data.toJSON() : slash.data
    );

    try {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commandsToRegister,
        });
        console.log("Registered application commands");
    } catch (error) {
        console.error("Failed to register application commands", error);
    }
};

exports.rotateSisterActivities = async (client) => {
    const fiveMinutes = 5 * 60 * 1000;
    const activities = [
        "PLAYING",
        "STREAMING",
        "LISTENING",
        "WATCHING",
        "COMPETING",
    ];
    const interval = setInterval(() => {
        const newActivityType = activities[randomInt(0, activities.length - 1)];
        if (client.user.presence.activities[0].type != newActivityType)
            client.user.setPresence({
                activities: [
                    {
                        name: "My sister",
                        type: newActivityType,
                    },
                ],
                status: "online",
            });
    }, fiveMinutes);
    return interval;
};
