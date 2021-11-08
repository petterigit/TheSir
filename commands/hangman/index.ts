import { Message, MessageEmbed } from "discord.js";
import { GameState, MessageParams } from "./hmTypes";
import dictionary from "./dictionary.json";
import { HANGMANPICS } from "./asciiArts";

const TOTALGUESSES = 6;

const gameState: GameState = {
    active: false,
    guessedCharacters: [],
    knownCharacters: [],
    guessesLeft: TOTALGUESSES,
    word: "",
    wordExplanation: "",
    errorMessage: "",
};
const messageParams: MessageParams = {
    hangManMessage: undefined,
    guessCharacter: "",
    messageContent: "",
    messageChannel: undefined,
};

/* MAIN */
const hangMan = async () => {
    if (!gameState.active) {
        /* GAME SETUP */
        resetGame();
        setHangMan();
        gameState.active = true;
    } else if (gameState.active) {
        /* MESSAGE VALIDATION */
        const messageRes = await checkMessage();
        if (messageRes === "exit") {
            resetGame();
            return;
        } else if (messageRes === "error") {
            await updateGameStateToUser();
            gameState.errorMessage = "";
            return;
        } else {
            messageParams.guessCharacter = messageRes;
        }

        /* USER GUESS HANDLING */
        const guessResult = await checkGuess(messageParams.guessCharacter);
        if (guessResult === true) {
            let position = gameState.word.indexOf(messageParams.guessCharacter);

            // Loop through indexes of characters in word
            while (position !== -1) {
                gameState.knownCharacters[position] = gameState.word[position];
                position = gameState.word.indexOf(
                    messageParams.guessCharacter,
                    position + 1
                );
            }

            // You win!
            if (gameState.knownCharacters.join("") === gameState.word) {
                await updateGameStateToUser();
                replyToChannel("You win! ");
                await replyToChannel("The word was: " + gameState.word);
                await sendWordExplanation();
                resetGame();
                return;
            }
        } else {
            gameState.guessesLeft--;

            // You lose!
            if (gameState.guessesLeft <= 0) {
                await updateGameStateToUser();
                await replyToChannel("You lost!");
                await replyToChannel("The word was: " + gameState.word);
                await sendWordExplanation();
                resetGame();
                return;
            }
        }
        await updateGameStateToUser();
    } else {
        await replyToChannel("Unknown state.. Restarting hangman");
        resetGame();
    }
};

/* GAME SETUP */
const resetGame = () => {
    gameState.active = false;
    gameState.guessedCharacters = [];
    gameState.knownCharacters = [];
    gameState.guessesLeft = 5;

    /* Sever ties to the old message so we won't go and change that ... */
    messageParams.hangManMessage = undefined;
};

const setHangMan = async () => {
    // Get a random word from dictionary
    const keys = Object.keys(dictionary);
    const randIndex = Math.floor(Math.random() * keys.length);

    gameState.word = keys[randIndex].toLowerCase();
    gameState.wordExplanation = dictionary[gameState.word];
    gameState.knownCharacters.length = gameState.word.length;
    gameState.knownCharacters.fill("\\_");

    await replyToChannel(
        "Hangman setup done! Type in your guesses after the 'hm' command"
    );
    await updateGameStateToUser();
};

/* MESSAGE VALIDATION */
const checkMessage = async () => {
    const guessString = messageParams.messageContent.substring(1).split(" ")[2];

    if (guessString === undefined) {
        gameState.errorMessage =
            "Empty guess.. Try a little harder! Or quit with 'hangman 0'";
        return "error";
    }
    if (guessString.length > 1) {
        gameState.errorMessage = "ONE. LETTER. AT. A. TIME. Thank you.'";
        return "error";
    }

    const messageCharacter = guessString.toLowerCase();
    if (messageCharacter === "0") {
        return "exit";
    }

    if (gameState.guessedCharacters.includes(messageCharacter)) {
        gameState.errorMessage = "You already tried this.. Bad memory?";
        return "error";
    } else if (gameState.knownCharacters.includes(messageCharacter)) {
        /* Should be covered by the clause above */
        return "error";
    }
    return messageCharacter;
};

/* USER GUESS HANDLING */
const checkGuess = async (messageCharacter: string) => {
    gameState.guessedCharacters.push(messageCharacter);
    if (gameState.word.includes(messageCharacter)) {
        /* Guess was correct ! */
        return true;
    } else {
        /* Guess was not correct ! */
        return false;
    }
};

/* GAME STATE UPDATES TO PLAYER */
const updateGameStateToUser = async () => {
    let gameStateString =
        `
        Your word:          ${gameState.knownCharacters.join(" ")}
        Guesses Left:       ${gameState.guessesLeft}
        Guessed Letters:    ${gameState.guessedCharacters}` +
        "```" +
        HANGMANPICS[TOTALGUESSES - gameState.guessesLeft] +
        "```";
    if (gameState.errorMessage != "") {
        gameStateString = gameStateString + "\n" + gameState.errorMessage;
    }

    const embed = new MessageEmbed();
    embed.setDescription(gameStateString);
    embed.setTitle("HANGMAN");
    if (messageParams.hangManMessage === undefined) {
        messageParams.hangManMessage = await messageParams.messageChannel.send({
            embeds: [embed],
        });
    } else {
        messageParams.hangManMessage.edit({ embeds: [embed] });
    }
};

const sendWordExplanation = async () => {
    await replyToChannel(gameState.word + ", " + gameState.wordExplanation);
};

const replyToChannel = async (message: string) => {
    messageParams.messageChannel.send(message);
};

module.exports = {
    data: {
        name: ["hangman", "hm"],
        description: "Hangman Game",
    },
    async execute(message: Message) {
        try {
            messageParams.messageChannel = message.channel;
            messageParams.messageContent = message.content;
            await hangMan();
        } catch (e) {
            console.log(e);
            replyToChannel("Hangman encountered an error.");
        }
    },
};
