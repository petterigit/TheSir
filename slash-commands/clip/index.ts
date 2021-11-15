import {
    joinVoiceChannel,
    VoiceConnectionStatus,
    entersState,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnection,
    AudioPlayer,
} from "@discordjs/voice";
import { ApplicationCommandTypes } from "discord.js/typings/enums";
import { CommandInteraction, GuildMember } from "discord.js";
import path from "path";

import { VoiceConnectionParams } from "./musicTypes";
import options from "./clipOptions";

const connectionParams: VoiceConnectionParams = {
    channelId: "",
    guildId: "",
    adapterCreator: null,
};

let voiceConnection: VoiceConnection;
let audioPlayer: AudioPlayer;
let data: { name: string; type: string };

module.exports = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["clip"],
        description: "Plays a sound clip. Then leaves, abruptly.",
        options: options,
    },
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply();
        getInteractionData(interaction);
        getConnectionParams(interaction);
        audioPlayer = createAudioPlayer();
        setAudioResource();
        voiceConnection = joinVoiceChannel(connectionParams);

        try {
            await audioIsPlaying(5);
            await voiceIsReady(5);
            voiceConnection.subscribe(audioPlayer);
            interaction.editReply("Playing " + data.name);
            await audioIsIdle(120);
        } finally {
            voiceConnection.destroy();
            interaction.editReply("Done with clip");
        }
    },
};

const getConnectionParams = (interaction: CommandInteraction) => {
    const member = interaction.member as GuildMember;
    connectionParams.channelId = member.voice.channelId;
    connectionParams.guildId = interaction.guild.id;
    connectionParams.adapterCreator = interaction.guild.voiceAdapterCreator;
};

const voiceIsReady = async (seconds: number) => {
    return entersState(
        voiceConnection,
        VoiceConnectionStatus.Ready,
        seconds * 1000
    );
};

const audioIsPlaying = async (seconds: number) => {
    return entersState(audioPlayer, AudioPlayerStatus.Playing, seconds * 1000);
};
const audioIsIdle = async (seconds: number) => {
    return entersState(audioPlayer, AudioPlayerStatus.Idle, seconds * 1000);
};

const setAudioResource = () => {
    const resource = createAudioResource(
        path.join(process.cwd(), "/public/sounds/", data.name + ".mp3")
    );
    audioPlayer.play(resource);
};

const getInteractionData = (interaction: CommandInteraction) => {
    data = interaction.options.data[0];
};
