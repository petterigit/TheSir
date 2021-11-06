"use strict";
/* IMPORT const voiceChannel = require('./scripts/voicechannel/main.js');
/* MAIN startVoice(message)
 */

/* TODO
 * message.member.voiceChannel = undefined
 */

const startVoice = async (message) => {
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
};

module.exports = {
    data: {
        name: ["join"],
        description: "Work in progress voice channel thing",
    },
    async execute(message) {
        await startVoice(message);
    },
};
