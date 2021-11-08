import {
    Collection,
    ColorResolvable,
    CommandInteraction,
    ExcludeEnum,
    GuildMember,
    Interaction,
    Message,
    MessageButton,
    Role,
    User,
} from "discord.js";
import { Command, DiscordClient, SlashCommands } from "./types";

import random from "lodash/random";
import * as fs from "fs";
import { APIRole, Routes } from "discord-api-types/v9";

import { MessageButtonStyles } from "discord.js/typings/enums";
import { REST } from "@discordjs/rest";

export const BUTTON_STYLE_LENGTH = 5;

export const getNicknameOrName = (
    message: Message | CommandInteraction
): string => {
    const member = message.member as GuildMember;
    if (member.nickname == null) {
        return member.user.username;
    }
    return member.nickname;
};
export const createUserMentionWithId = (id: string): string => `<@!${id}>`;
export const createRoleMentionWithId = (id: string): string => `<@&${id}>`;
export const createEveryoneMention = (): string => "@everyone";
export const createMention = (interaction: Interaction): string => {
    return `<@${interaction.member.user.id}>`;
};
export const isGuildMember = (
    mention: GuildMember | Role | APIRole | User
): mention is GuildMember => {
    return (mention as GuildMember).user != null;
};
export const isRole = (
    mention: GuildMember | Role | APIRole | User
): mention is Role | APIRole => {
    return (mention as Role | APIRole).name != null;
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

export const InputTypes = {
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

export const randomColor = (): ColorResolvable => {
    let color = "#";
    for (let i = 0; i < 3; i++) {
        color += random(0, 255).toString(16);
    }

    return color as ColorResolvable;
};

export const requireCommands = async <T>(
    folderName: string
): Promise<Collection<string, Command<T>>> => {
    const commands = new Collection<string, Command<T>>();
    const folders = fs.readdirSync(`./${folderName}/`);

    for (const folder of folders) {
        const command = await import(`./${folderName}/${folder}`);
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

export const executeCommand = async <T>(
    interaction: T,
    handler: Command<T>,
    client: DiscordClient
) => {
    if (!handler) return;

    try {
        await handler.execute(interaction, client);
    } catch (error) {
        console.error(error);
    }
};

export const registerSlashCommands = async (
    commands: SlashCommands,
    rest: REST
): Promise<void> => {
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
            await rest.put(Routes.applicationCommands(clientId), {
                body: commandsToRegister,
            });
            console.log("Registered global commands");
        }
    } catch (error) {
        console.error("Failed to register application commands", error);
    }
};

export const rotateSisterActivities = async (
    client: DiscordClient
): Promise<NodeJS.Timer> => {
    const fiveMinutes = 5 * 60 * 1000;
    const interval = setInterval(() => {
        //const newActivityType = _.sample(Object.values(ActivityTypes));
        //if (client.user.presence.activities[0].type != newActivityType)
        const newActivityType = random(0, BUTTON_STYLE_LENGTH);
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
