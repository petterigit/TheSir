"use strict";

const commands_list = [
    "poke @mention\n",
    "help\n",
    "join (in production)\n",
    "ping\n",
    ]

exports.replyCommands = async (message) => {
    try {
        message.channel.send("Available commands: ", commands_list);
    }
    catch (error) {
        console.log(error)
    }

}
