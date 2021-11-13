import {
    joinVoiceChannel,
    VoiceConnectionStatus,
    entersState,
} from "@discordjs/voice";
import { ApplicationCommandTypes } from "discord.js/typings/enums";

import { Message } from "discord.js";

module.exports = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["kala"],
        description: "KALAKALAKALAKALAKALAKAVERI",
    },
    async execute(message: Message) {
        message.channel.send("kala");
        console.log("kala");

        connect(message);
    },
};

async function connect(message: Message) {
    try {
        const channelId = message.member.voice.channelId;
        const guildId = message.guild.id;
        const adapterCreator = message.guild.voiceAdapterCreator;

        const connection = joinVoiceChannel({
            channelId: channelId,
            guildId: guildId,
            adapterCreator: adapterCreator,
        });

        await entersState(connection, VoiceConnectionStatus.Signalling, 5_000);
        console.log("Signalling");
        await entersState(connection, VoiceConnectionStatus.Ready, 5_000);
        console.log("Ready");
    } catch (error) {
        console.error(error);
    } finally {
        // Close Connection
    }
}
