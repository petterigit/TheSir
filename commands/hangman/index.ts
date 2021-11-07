import {
    DMChannel,
    Message,
    NewsChannel,
    PartialDMChannel,
    TextChannel,
    ThreadChannel,
} from "discord.js";

import dictionary from "./dictionary.json";

let word: string;
let wordExplanation: string;

let gameState = "not active";
let processing = false;
const guessedCharacters: string[] = [];
const knownCharacters: string[] = [];
let guessesLeft = 5;
let guessCharacter: string;
let messageContent: string;
let messageChannel:
    | TextChannel
    | PartialDMChannel
    | DMChannel
    | NewsChannel
    | ThreadChannel;

/* MAIN */
const hangMan = async () => {
    if (gameState === "not active") {
        gameState = "active";
        setHangMan();
    } else if (gameState === "active") {
        // Check if given message is valid
        const messageRes = await checkMessage();
        if (messageRes === "exit") {
            gameState = "not active";
            return;
        } else if (messageRes === "error") {
            return;
        } else {
            guessCharacter = messageRes;
        }
        // Check if given character is in the word
        const guessResult = await checkGuess(guessCharacter);
        if (guessResult === true) {
            // If the guess was correct, do stuff
            let position = word.indexOf(guessCharacter);
            while (position !== -1) {
                knownCharacters[position] = word[position];
                position = word.indexOf(guessCharacter, position + 1);
            }
            if (knownCharacters.join("") === word) {
                replyToChannel("You win! ");
                await replyToChannel("The word was: " + word);
                await sendWordExplanation();
                gameState = "not active";
                return;
            }

            //word = word.replaceAll(guessCharacter, "");
        } else {
            // If the guess was not correct, do stuff
            guessesLeft--;
            if (guessesLeft <= 0) {
                await replyToChannel("You lost!");
                await replyToChannel("The word was: " + word);
                await sendWordExplanation();
                gameState = "not active";
                return;
            }
        }

        await replyToChannel("Your guesses: " + guessedCharacters);
        await replyToChannel("Known characters in word: " + knownCharacters);
        await replyToChannel("Guesses left: " + guessesLeft.toString());
    } else {
        await replyToChannel("Unknown state.. Restarting hangman");
        gameState = "not active";
    }
};

module.exports = {
    data: {
        name: ["hangman"],
        description: "Hangman Game",
    },
    async execute(message: Message) {
        // Make sure we're not overloaded with messages
        // Doesn't work currently... (Important for handling single message & channel at a time..)
        // I think it's already handled on top level -- Bot handles commands in a single thread or something...
        if (!processing) {
            processing = true;
            messageChannel = message.channel;
            messageContent = message.content;
            hangMan();
            processing = false;
        } else {
            replyToChannel("You're sending too many messages at once.. pls no");
        }
    },
};

/* GAME SETUP */
const setHangMan = async () => {
    // Get a random word from dictionary
    const keys = Object.keys(dictionary);
    const randIndex = Math.floor(Math.random() * keys.length);

    // Set word
    word = keys[randIndex].toLowerCase();
    wordExplanation = dictionary[word];
    knownCharacters.length = word.length;
    knownCharacters.fill("@");

    /* Print Game Board to Player */
    await replyToChannel(
        "Hangman setup done! Type in your guesses after the 'hangman' command"
    );
};

/* VALIDATING MESSAGE CONTENTS */
const checkMessage = async () => {
    const guessString = messageContent.substring(1).split(" ")[2];

    if (guessString === undefined) {
        await replyToChannel(
            "Empty guess.. Try a little harder! Or quit with 'hangman 0'"
        );
        return "error";
    }
    if (guessString.length > 1) {
        await replyToChannel("ONE. LETTER. AT. A. TIME. Thank you.'");
        return "error";
    }

    const messageCharacter = guessString.toLowerCase();
    if (messageCharacter === "0") {
        gameState = "not active";
        return "exit";
    }

    if (guessedCharacters.includes(messageCharacter)) {
        await replyToChannel(
            "You already tried this.. Bad memory? Need me to spell your guesses out loud?"
        );
        await replyToChannel("YOUR GUESSES SO FAR ARE: ");
        for (let i = 0; i < guessedCharacters.length; i++) {
            await replyToChannel(guessedCharacters[i]);
        }
        await replyToChannel("Please, continue.");
        return "error";
    } else if (knownCharacters.includes(messageCharacter)) {
        await replyToChannel(
            "We already know that the word does infact contain the letter '" +
                messageCharacter +
                "'."
        );
        return "error";
    }
    return messageCharacter;
};

/* NORMAL GAME FLOW */
const checkGuess = async (messageCharacter: string) => {
    await replyToChannel("You guessed: " + messageCharacter);
    guessedCharacters.push(messageCharacter);
    if (word.includes(messageCharacter)) {
        /* Guess was correct ! */
        await replyToChannel(
            "'" + messageCharacter + "' was in the word. Good guess!"
        );
        return true;
    } else {
        /* Guess was not correct ! */
        await replyToChannel(
            "'" + messageCharacter + "' was not in the word. Try again!"
        );
        return false;
    }
};

const sendWordExplanation = async () => {
    await replyToChannel(word + ", " + wordExplanation);
};

const replyToChannel = async (message: string) => {
    messageChannel.send(message);
};
