import { Message, MessageEmbed } from "discord.js";
import { GameState, MessageParams } from "./hmTypes";
import dictionary from "./dictionary.json";
import { HANGMANPICS } from "./asciiArts";

const TOTALGUESSES = 6;

let RUNNINGGAMES: GameState[] = [];

const messageParams: MessageParams = {
    messageChannel: undefined,
    currentChannelID: "",
    guessCharacter: "",
    messageContent: "",
};

/* MAIN */
const hangman = async () => {
    const currentGame = RUNNINGGAMES.find(
        (game) => game.channelID == messageParams.currentChannelID
    );

    if (currentGame === undefined) {
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
    const currentGame = {
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

const setHangman = async (currentGame: GameState) => {
    // Get a random word from dictionary
    const keys = Object.keys(dictionary);
    const randIndex = Math.floor(Math.random() * keys.length);

    currentGame.word = keys[randIndex].toLowerCase();
    currentGame.wordExplanation = dictionary[currentGame.word];
    currentGame.knownCharacters.length = currentGame.word.length;
    currentGame.knownCharacters.fill("\\_");

    await replyToChannel(
        "Hangman setup done! Type in your guesses after the 'hm' command"
    );
    await updateGameStateToUser(currentGame);
};

const removeGame = (currentGame: GameState) => {
    RUNNINGGAMES = RUNNINGGAMES.filter((game) => game !== currentGame);
};

/* MESSAGE VALIDATION */
const checkMessage = async (currentGame: GameState) => {
    const guessString = messageParams.messageContent.substring(1).split(" ")[2];

    if (guessString === undefined) {
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

    const embed = new MessageEmbed();
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

const getMessageParams = (message: Message) => {
    messageParams.currentChannelID = message.channel.id;
    messageParams.messageChannel = message.channel;
    messageParams.messageContent = message.content;
};

module.exports = {
    data: {
        name: ["hangman", "hm"],
        description: "Hangman Game",
    },
    async execute(message: Message) {
        try {
            getMessageParams(message);
            await hangman();
        } catch (e) {
            console.log(e);
            replyToChannel("Hangman encountered an error.");
        }
    },
};
