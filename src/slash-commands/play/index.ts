import {
    joinVoiceChannel,
    VoiceConnectionStatus,
    entersState,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnection,
    AudioPlayer,
    StreamType,
    AudioResource,
} from "@discordjs/voice";
import {
    ApplicationCommandType,
    CacheType,
    ChatInputCommandInteraction,
    CommandInteractionOption,
    GuildMember,
} from "discord.js";
import path from "path";
import ytdl from "ytdl-core";

import { VoiceConnectionParams } from "./musicTypes";
import options from "./clipOptions";
import { SlashCommandModule } from "../../types";

const connectionParams: VoiceConnectionParams = {
    channelId: "",
    guildId: "",
    adapterCreator: null,
};

let voiceConnection: VoiceConnection;
let audioPlayer: AudioPlayer;
let data: CommandInteractionOption<CacheType>;

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: ["play"],
        description: "Plays music from given source.",
        options: options,
    },
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        try {
            getInteractionData(interaction);
            getConnectionParams(interaction);
            audioPlayer = createAudioPlayer();
            setAudioResource();
            voiceConnection = joinVoiceChannel(connectionParams);
        } catch (e) {
            interaction.editReply("Something went wrong in setting up audio..");
            return;
        }

        try {
            console.log("Waiting on audio");
            await audioIsPlaying(15);
            console.log("Waiting on voice");
            await voiceIsReady(15);
            console.log("Subscribeling");
            voiceConnection.subscribe(audioPlayer);
            interaction.editReply("Playing " + data.name);

            // 5 minute max clip play-time
            await audioIsIdle(300);
        } finally {
            voiceConnection.destroy();
        }
    },
};

const getConnectionParams = (interaction: ChatInputCommandInteraction) => {
    try {
        const member = interaction.member as GuildMember;
        connectionParams.channelId = member.voice.channelId;
        if (connectionParams.channelId === null) {
            throw Error;
        }
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
    let resource: AudioResource;
    try {
        if (data.name === "clip") {
            resource = createAudioResource(
                path.join(
                    process.cwd(),
                    "/public/sounds/",
                    data.options[0].name + ".mp3"
                )
            );
        } else if (data.name === "youtube") {
            //const url = "https://www.youtube.com/watch?v=aAkMkVFwAoo";
            const url = data.options[0].value as string;
            const stream = ytdl(url, {
                filter: "audioonly",
            });
            resource = createAudioResource(stream, {
                inputType: StreamType.Arbitrary,
            });
        }
    } catch (e) {
        return e;
    }

    audioPlayer.play(resource);
};

const getInteractionData = (interaction: ChatInputCommandInteraction) => {
    data = interaction.options.data[0];
};

export default command;
