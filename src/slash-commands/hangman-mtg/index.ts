import {
    ApplicationCommandOptionData,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChannelType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    TextChannel,
} from "discord.js";
import { CardData, GameState, MessageParams } from "./hmTypes";
import { HANGMANPICS } from "./asciiArts";
import { SlashCommandModule } from "../../types";

const TOTALGUESSES = 6;

let RUNNINGGAMES: GameState[] = [];

const messageParams: MessageParams = {
    messageChannel: undefined,
    currentChannelID: "",
    guessCharacter: "",
};

const inputs: ApplicationCommandOptionData[] = [
    {
        type: ApplicationCommandOptionType.String,
        name: "guess",
        description: "Guess a letter",
        required: false,
    },
];

/* MAIN */
const hangmanMtg = async () => {
    const currentGame = RUNNINGGAMES.find(
        (game) => game.channelID == messageParams.currentChannelID
    );

    if (!currentGame) {
        const currentGame = setGame();
        setHangman(currentGame);
        return;
    }
    /* MESSAGE VALIDATION */
    const messageRes = await checkMessage(currentGame);
    if (messageRes === "exit") {
        removeGame(currentGame);
        return;
    } else if (messageRes === "error") {
        await updateGameStateToUser(currentGame);
        currentGame.errorMessage = "";
        return;
    } else {
        messageParams.guessCharacter = messageRes;
    }

    /* USER GUESS HANDLING */
    const guessResult = await checkGuess(
        messageParams.guessCharacter,
        currentGame
    );
    if (guessResult === true) {
        let position = currentGame.word.indexOf(messageParams.guessCharacter);

        // Loop through indexes of characters in word
        while (position !== -1) {
            currentGame.knownCharacters[position] = currentGame.word[position];
            position = currentGame.word.indexOf(
                messageParams.guessCharacter,
                position + 1
            );
        }

        // You win!
        if (currentGame.knownCharacters.join("") === currentGame.word) {
            await updateGameStateToUser(currentGame);
            replyToChannel("You win! ");
            await replyToChannel("The word was: " + currentGame.word);
            await sendWordExplanation(currentGame);
            removeGame(currentGame);
            return;
        }
    } else {
        currentGame.guessesLeft--;

        // You lose!
        if (currentGame.guessesLeft <= 0) {
            await updateGameStateToUser(currentGame);
            await replyToChannel("You lost!");
            await replyToChannel("The word was: " + currentGame.word);
            await sendWordExplanation(currentGame);
            removeGame(currentGame);
            return;
        }
    }
    await updateGameStateToUser(currentGame);
};

/* GAME SETUP */
const setGame = () => {
    const currentGame: GameState = {
        channelID: messageParams.currentChannelID,
        active: true,
        guessedCharacters: [],
        knownCharacters: [],
        guessesLeft: TOTALGUESSES,
        word: "",
        wordExplanation: "",
        errorMessage: "",
        hangmanMessage: undefined,
    };
    RUNNINGGAMES.push(currentGame);
    return currentGame;
};

export const getRandomCard = async () => {
    const res = await fetch("https://api.scryfall.com/cards/random", {
        method: "get",
    });

    const data = (await res.json()) as CardData;

    return data;
};

const setHangman = async (currentGame: GameState) => {
    const hmCard = await getRandomCard();
    const word = hmCard.name;

    currentGame.word = word.toLowerCase(); // u2000 = Loooong space - here for styling & win condition checking

    currentGame.wordExplanation = hmCard.scryfall_uri;

    currentGame.knownCharacters.length = currentGame.word.length;
    currentGame.knownCharacters.fill("\\_");

    let i = hmCard.name.length;

    while (i--) {
        if (hmCard.name[i] === " ") {
            currentGame.knownCharacters[i] = "\u2000";
            continue;
        }
        if ("-_`', ".includes(hmCard.name[i])) {
            currentGame.knownCharacters[i] = currentGame.word[i];
        }
    }

    await replyToChannel(
        "Hangman setup done! Guess with the 'hangman' command! Guess 0 to quit."
    );
    await updateGameStateToUser(currentGame);
};

const removeGame = (currentGame: GameState) => {
    RUNNINGGAMES = RUNNINGGAMES.filter((game) => game !== currentGame);
};

/* MESSAGE VALIDATION */
const checkMessage = async (currentGame: GameState) => {
    const guessString = messageParams.guessCharacter;

    if (!guessString) {
        currentGame.errorMessage =
            "Empty guess.. Try a little harder! Or quit with 'hangman 0'";
        return "error";
    }
    if (guessString.length > 1) {
        currentGame.errorMessage = "ONE. LETTER. AT. A. TIME. Thank you.'";
        return "error";
    }

    const messageCharacter = guessString.toLowerCase();
    if (messageCharacter === "0") {
        return "exit";
    }

    if (currentGame.guessedCharacters.includes(messageCharacter)) {
        currentGame.errorMessage = "You already tried this.. Bad memory?";
        return "error";
    } else if (currentGame.knownCharacters.includes(messageCharacter)) {
        /* Should be covered by the clause above */
        return "error";
    }
    return messageCharacter;
};

/* USER GUESS HANDLING */
const checkGuess = async (messageCharacter: string, currentGame: GameState) => {
    currentGame.guessedCharacters.push(messageCharacter);
    if (currentGame.word.includes(messageCharacter)) {
        /* Guess was correct ! */
        return true;
    } else {
        /* Guess was not correct ! */
        return false;
    }
};

/* GAME STATE UPDATES TO PLAYER */
const updateGameStateToUser = async (currentGame: GameState) => {
    let gameStateString =
        `
        Your word:          ${currentGame.knownCharacters.join(" ")}
        Guesses Left:       ${currentGame.guessesLeft}
        Guessed Letters:    ${currentGame.guessedCharacters}` +
        "```" +
        HANGMANPICS[TOTALGUESSES - currentGame.guessesLeft] +
        "```";
    if (currentGame.errorMessage != "") {
        gameStateString = gameStateString + "\n" + currentGame.errorMessage;
    }

    const embed = new EmbedBuilder();
    embed.setDescription(gameStateString);
    embed.setTitle("HANGMAN");
    if (currentGame.hangmanMessage === undefined) {
        currentGame.hangmanMessage = await messageParams.messageChannel.send({
            embeds: [embed],
        });
    } else {
        currentGame.hangmanMessage.edit({ embeds: [embed] });
    }
};

const sendWordExplanation = async (currentGame: GameState) => {
    await replyToChannel(currentGame.word + ", " + currentGame.wordExplanation);
};

const replyToChannel = async (message: string) => {
    messageParams.messageChannel.send(message);
};

const getMessageParams = (interaction: ChatInputCommandInteraction) => {
    if (interaction.channel.type === ChannelType.GuildVoice) {
        return;
    }

    messageParams.currentChannelID = interaction.channel.id;
    messageParams.messageChannel = interaction.channel as TextChannel;
    messageParams.guessCharacter = interaction.options.getString("guess");
};

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: ["hangman-mtg"],
        description: "Hangman Game (MTG version)",
        options: inputs,
    },
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply();
            getMessageParams(interaction);
            await hangmanMtg();
            await interaction.deleteReply();
        } catch (e) {
            console.log(e);
            replyToChannel("Hangman encountered an error.");
        }
    },
};

export default command;
