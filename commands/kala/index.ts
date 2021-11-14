import {
    joinVoiceChannel,
    VoiceConnectionStatus,
    entersState,
    createAudioPlayer,
    createAudioResource,
    StreamType,
    AudioPlayerStatus,
    AudioPlayer,
    PlayerSubscription,
} from "@discordjs/voice";
import { ApplicationCommandTypes } from "discord.js/typings/enums";

import path from "path";
import { Message } from "discord.js";
import { ConnectionVisibility } from "discord-api-types";

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
    const channelId = message.member.voice.channelId;
    const guildId = message.guild.id;
    const adapterCreator = message.guild.voiceAdapterCreator;

    const voiceConnection = joinVoiceChannel({
        channelId: channelId,
        guildId: guildId,
        adapterCreator: adapterCreator,
    });
    const audioPlayer = createAudioPlayer();
    await playKala(audioPlayer);

    console.log("Audio Source Set");
    try {
        await entersState(
            voiceConnection,
            VoiceConnectionStatus.Ready,
            15_0000
        );
        console.log("Voice Connection Ready");

        voiceConnection.subscribe(audioPlayer);
        console.log("Subscribeled");
        await entersState(audioPlayer, AudioPlayerStatus.Playing, 15_0000);
        console.log("Audio player playing");
        audioPlayer.unpause();
        /* Audio player doesn't do a thing, goes straight to idle */
        await entersState(audioPlayer, AudioPlayerStatus.Idle, 15_0000);
        //await entersState(audioPlayer, AudioPlayerStatus.Playing, 15_0000);
        console.log("Audio player idle");
        return voiceConnection;
    } catch (error) {
        console.error(error);
    } finally {
        voiceConnection.destroy();
    }
}

const playKala = async (player: AudioPlayer) => {
    const resource = createAudioResource(
        path.join(process.cwd(), "/public/sounds/kala.mp3")
    );
    /*const resource = createAudioResource(
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        {
            inputType: StreamType.Arbitrary,
        }
    );
    */
    player.play(resource);

    /* Return error if it takes more than 5s to boot */
    return entersState(player, AudioPlayerStatus.Playing, 5e3);
};
