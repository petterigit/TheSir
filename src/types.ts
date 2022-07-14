import {
    ApplicationCommandData,
    ApplicationCommandOptionData,
    ButtonInteraction,
    Client,
    Collection,
    CommandInteraction,
    Message,
} from "discord.js";

export interface DiscordClient extends Client {
    interactions: Interactions;
    commands: Commands;
    slashCommands: SlashCommands;
}

export type Interactions = Collection<string, Command<ButtonInteraction>>;
export type Commands = Collection<string, Command<Message>>;
export type SlashCommands = Collection<string, Command<CommandInteraction>>;

export type Command<T> = {
    data: ApplicationCommandData;
    execute: (message: T, client?: DiscordClient) => Promise<void>;
};

export interface SlashCommandModule {
    data: {
        type: "CHAT_INPUT";
        name: string | string[];
        description: string;
        options: ApplicationCommandOptionData[];
    };
    execute: (
        message: CommandInteraction | ButtonInteraction,
        client?: DiscordClient
    ) => Promise<void>;
}
