"use strict";

const commands = [
    "poke @mention\n",
    "help\n",
    "join (in production)\n",
    "ping\n",
    ]

exports.commands = async (message) => {
    try {
        message.reply("Available commands: ", commands);
    }
    catch (error) {
        console.log(error)
    }

}
