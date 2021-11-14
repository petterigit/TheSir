import {
    joinVoiceChannel,
    VoiceConnectionStatus,
    entersState,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
} from "@discordjs/voice";
import { ApplicationCommandTypes } from "discord.js/typings/enums";
import { CommandInteraction, GuildMember } from "discord.js";
import path from "path";
import { VoiceConnectionParams } from "./musicTypes";

const connectionParams: VoiceConnectionParams = {
    channelId: "",
    guildId: "",
    adapterCreator: null,
};

let voiceConnection;
let audioPlayer;

module.exports = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["clip"],
        description: "Plays a sound clip. Then leaves, abruptly.",
    },
    async execute(interaction: CommandInteraction) {
        getConnectionParams(interaction);

        audioPlayer = createAudioPlayer();
        setAudioResource("kala.mp3");
        voiceConnection = joinVoiceChannel(connectionParams);

        try {
            // Wait for connection & audio player to be ready
            await audioIsPlaying();
            await voiceIsReady();

            voiceConnection.subscribe(audioPlayer);

            await audioIsIdle();
        } finally {
            // Kill connection when ready
            voiceConnection.destroy();
        }
    },
};

const getConnectionParams = (interaction: CommandInteraction) => {
    const member = interaction.member as GuildMember;
    connectionParams.channelId = member.voice.channelId;
    connectionParams.guildId = interaction.guild.id;
    connectionParams.adapterCreator = interaction.guild.voiceAdapterCreator;
};

const voiceIsReady = async () => {
    return entersState(voiceConnection, VoiceConnectionStatus.Ready, 15_000);
};

const audioIsPlaying = async () => {
    return entersState(audioPlayer, AudioPlayerStatus.Playing, 15_0000);
};
const audioIsIdle = async () => {
    return entersState(audioPlayer, AudioPlayerStatus.Idle, 15_000);
};

const setAudioResource = (sound: string) => {
    const resource = createAudioResource(
        path.join(process.cwd(), "/public/sounds/", sound)
    );

    audioPlayer.play(resource);
};
