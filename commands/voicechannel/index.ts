"use strict";

import { Message } from "discord.js";

/* IMPORT const voiceChannel = require('./scripts/voicechannel/main.js');
/* MAIN startVoice(message)
 */

/* TODO
 * message.member.voiceChannel = undefined
 */

const startVoice = async (message: Message) => {
    message.reply("I'm rikki");
    /*
    try {
        if (message.member.voiceChannel) {
            message.member.voiceChannel
                .join()
                .then((connection) => {
                    // Connection is an instance of VoiceConnection
                    message.reply("I'm in");
                    const dispatcher = connection.playFile("./music.mp3");
                    dispatcher.on("end", () => {
                        message.reply("I'm out");
                        message.member.voiceChannel.leave();
                    });
                })
                .catch(console.log);
        } else {
            message.reply("You need to join a voice channel first!");
        }
    } catch (error) {
        message.reply("Aaaaaaaaa");
        console.log(error);
    }
    */
};

export default {
    data: {
        name: ["join"],
        description: "Work in progress voice channel thing",
    },
    async execute(message: Message) {
        await startVoice(message);
    },
};
