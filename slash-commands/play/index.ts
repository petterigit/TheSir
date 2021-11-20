import {
    joinVoiceChannel,
    VoiceConnectionStatus,
    entersState,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnection,
    AudioPlayer,
    AudioResource,
} from "@discordjs/voice";
import { ApplicationCommandTypes } from "discord.js/typings/enums";
import {
    CacheType,
    CommandInteraction,
    CommandInteractionOption,
    GuildMember,
} from "discord.js";
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
let data: CommandInteractionOption<CacheType>;

module.exports = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["play"],
        description: "Plays music from given source.",
        options: options,
    },
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply();

        try {
            getInteractionData(interaction);
            getConnectionParams(interaction);
            audioPlayer = createAudioPlayer();
            setAudioResource();
            voiceConnection = joinVoiceChannel(connectionParams);
        } catch (e) {
            return;
        }

        try {
            await audioIsPlaying(5);
            await voiceIsReady(5);
            voiceConnection.subscribe(audioPlayer);
            interaction.editReply("Playing " + data.name);
            await audioIsIdle(120);
        } finally {
            voiceConnection.destroy();
        }
    },
};

const getConnectionParams = (interaction: CommandInteraction) => {
    try {
        const member = interaction.member as GuildMember;
        connectionParams.channelId = member.voice.channelId;
        if (connectionParams.channelId === null) {
            throw Error;
        }
        console.log();
        connectionParams.guildId = interaction.guild.id;
        connectionParams.adapterCreator = interaction.guild.voiceAdapterCreator;
    } catch (e) {
        interaction.editReply("Join voice first");
        return Error;
    }
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
    let resource: AudioResource | undefined;
    if (data.name === "clip") {
        resource = createAudioResource(
            path.join(
                process.cwd(),
                "/public/sounds/",
                data.options[0].name + ".mp3"
            )
        );
    }

    audioPlayer.play(resource);
};

const getInteractionData = (interaction: CommandInteraction) => {
    data = interaction.options.data[0];
};
