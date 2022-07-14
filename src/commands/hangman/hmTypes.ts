import {
    DMChannel,
    Message,
    NewsChannel,
    PartialDMChannel,
    TextChannel,
    ThreadChannel,
} from "discord.js";

export type GameState = {
    active: boolean;
    guessedCharacters: string[];
    knownCharacters: string[];
    guessesLeft: number;
    word: string;
    wordExplanation: string;
    errorMessage: string;
    channelID: string;
    hangmanMessage: Message;
};

export type MessageParams = {
    messageChannel:
        | DMChannel
        | PartialDMChannel
        | TextChannel
        | NewsChannel
        | ThreadChannel;
    currentChannelID: string;
    guessCharacter: string;
    messageContent: string;
};
