import {
    ApplicationCommandData,
    ButtonInteraction,
    Client,
    Collection,
    CommandInteraction,
    Interaction,
    Message,
} from "discord.js";

export interface DiscordClient extends Client {
    interactions: Interactions;
    commands: Commands;
    slashCommands: SlashCommands;
}

export type Interactions = Collection<string, SirInteraction>;
export type Commands = Collection<string, Command>;
export type SlashCommands = Collection<string, SlashCommand>;

export type SirInteraction = {
    data: ApplicationCommandData;
    constants?: string[];

    execute: (message: ButtonInteraction, client?: DiscordClient) => void;
};

export type Command = {
    data: ApplicationCommandData;
    execute: (message: Message, client?: DiscordClient) => void;
};

export type SlashCommand = {
    data: ApplicationCommandData;
    constants: string[];
    execute: (message: CommandInteraction, client?: DiscordClient) => void;
};
