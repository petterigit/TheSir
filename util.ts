import {
    ButtonInteraction,
    Collection,
    CommandInteraction,
    ExcludeEnum,
    Interaction,
    Message,
    MessageButton,
} from "discord.js";
import {
    Command,
    DiscordClient,
    SirInteraction,
    SlashCommand,
    SlashCommands,
} from "./types";

const Discord = require("discord.js");
const fs = require("fs");
import _ = require("lodash");
const { Routes } = require("discord-api-types/v9");
import { MessageButtonStyles } from "discord.js/typings/enums";

exports.getNicknameOrName = (message: Message) => {
    if (message.member.nickname == null) {
        return message.member.user.username;
    }
    return message.member.nickname;
};
exports.createUserMentionWithId = (id: string) => `<@!${id}>`;
exports.createRoleMentionWithId = (id: string) => `<@&${id}>`;
exports.createEveryoneMention = () => "@everyone";
exports.createMention = (interaction: Interaction): string => {
    return `<@${interaction.member.user.id}>`;
};

export const createButton = (
    id: string,
    text: string,
    style: ExcludeEnum<
        typeof MessageButtonStyles,
        "LINK"
    > = MessageButtonStyles.PRIMARY
) => {
    return new MessageButton({
        customId: id,
        label: text,
        style: style,
    });
};

exports.InputTypes = {
    SubCommand: 1,
    SubCommandGroup: 2,
    String: 3,
    Integer: 4,
    Boolean: 5,
    User: 6,
    Channel: 7,
    Role: 8,
    Mentionable: 9,
    Number: 10,
};

export const randomColor = () => {
    let color = "#";
    for (let i = 0; i < 3; i++) {
        color += _.random(0, 255).toString(16);
    }
    return color;
};

exports.requireCommands = (folderName: string) => {
    const commands: Collection<Command, string> = new Discord.Collection();
    const folders = fs.readdirSync(`./${folderName}/`);

    for (const folder of folders) {
        const command = require(`./${folderName}/${folder}`);
        if (command?.data?.name) {
            if (Array.isArray(command.data.name)) {
                command.data.name.map((name) =>
                    commands.set(name, {
                        ...command,
                        data: { ...command.data, name: name },
                    })
                );
            } else {
                commands.set(command.data.name, command);
            }
        }
    }

    return commands;
};

exports.executeCommand = async (
    interaction: CommandInteraction | ButtonInteraction,
    handler,
    client: DiscordClient
) => {
    if (!handler) return;

    try {
        console.log("interacting");
        await handler.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this interaction!",
            ephemeral: true,
        });
    }
};

exports.registerSlashCommands = async (commands: SlashCommands, rest: any) => {
    const guildId = process.env.GUILD_ID;
    const clientId = process.env.CLIENT_ID;
    const environment = process.env.ENVIRONMENT;
    const isProduction = environment?.toLowerCase() === "production";

    if (!guildId) {
        console.log(
            "Skipping application command registration: GUILD_ID or CLIENT_ID not found in environment variables"
        );
        return;
    }
    const commandsToRegister = commands.map((slash) => slash.data);

    try {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commandsToRegister,
        });
        console.log("Registered guild commands");

        if (isProduction) {
            await rest.put(Routes.applicationCommands(clientId, guildId), {
                body: commandsToRegister,
            });
            console.log("Registered global commands");
        }
    } catch (error) {
        console.error("Failed to register application commands", error);
    }
};

exports.rotateSisterActivities = async (client: DiscordClient) => {
    const fiveMinutes = 5 * 60 * 1000;
    const interval = setInterval(() => {
        //F.U Nipa,
        //const newActivityType = _.sample(Object.values(ActivityTypes));
        //if (client.user.presence.activities[0].type != newActivityType)
        const newActivityType = _.random(0, 5);
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
