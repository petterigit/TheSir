import { InternalDiscordGatewayAdapterCreator } from "discord.js";

export type VoiceConnectionParams = {
    channelId: string;
    guildId: string;
    adapterCreator: InternalDiscordGatewayAdapterCreator;
};
