import { Client, Collection, Interaction, Message } from "discord.js";

export interface DiscordClient extends Client {
    interactions: Interaction[];
    commands: Collection<Command, string>;
    slashCommands: SlashCommand[];
}

export interface Command {
    data: {
        name: string[];
        description: string;
    };
    execute: (message: Message, client?: DiscordClient) => void;
}

export interface SlashCommand {
    data: {
        name: string[];
        description: string;
    };
    constants: string[];
    execute: (message: Message, client?: DiscordClient) => void;
}
