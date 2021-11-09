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
};

export type MessageParams = {
    hangmanMessage: Message;
    guessCharacter: string;
    messageContent: string;
    messageChannel:
        | DMChannel
        | NewsChannel
        | PartialDMChannel
        | TextChannel
        | ThreadChannel;
};
