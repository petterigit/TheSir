"use strict";

const commands = `
    poke @mention
    help
    join (in production)
    ping
`

exports.replyCommands = async (message) => {
    try {
        message.channel.send("Available commands: " + commands);
    }
    catch (error) {
        console.log(error)
    }

}
