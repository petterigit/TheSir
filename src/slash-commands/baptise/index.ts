import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";

import axios from "axios";
import sample from "lodash/sample";
import { SlashCommandModule } from "../../types";
import {
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
} from "discord.js/typings/enums";
import { getMemberNicknameOrName, isMentionGuildMember } from "../../util";

const TITLEURL = "https://proksi.juho.space/pet-name";
const MAX_NAME_LENGTH = 32;

const inputs: ApplicationCommandOptionData[] = [
    {
        type: ApplicationCommandOptionTypes.MENTIONABLE,
        name: "mention",
        description: "Someone to baptise",
        required: true,
    },
];

const startBaptise = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const member = interaction.options.getMentionable("mention");
    if (!member || !isMentionGuildMember(member)) {
        interaction.editReply({ content: "You need to mention a user" });
        return;
    }

    try {
        const originalName = getMemberNicknameOrName(member);
        const memberName = originalName.split(",")[0];
        await interaction.editReply(
            `**${originalName}** has lived a sinful life and will be baptised in the Saimaa to become one with the God again`
        );

        const newName = await createPetName(memberName);
        await member.setNickname(newName);
        await interaction.editReply(
            `**${originalName}** has been baptised to become **${newName}**`
        );
    } catch (e) {
        console.error(e);
        interaction.editReply(
            `**${getMemberNicknameOrName(member)}** could not be baptised :(`
        );
    }
};

const createPetName = async (memberName: string) => {
    try {
        const response = await axios(TITLEURL);
        const data = await response.data;
        let petName = memberName;
        if (petName.length >= MAX_NAME_LENGTH - 10) {
            return petName;
        } else {
            petName += ", The";
            for (;;) {
                const x = sample(data) as string;
                if (x.length + 1 + petName.length <= MAX_NAME_LENGTH)
                    petName += " " + x;
                else break;
            }
            return petName;
        }
    } catch (error) {
        console.error(error);
    }
};

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["baptise"],
        description: "Give people a new and unique nickname",
        options: inputs,
    },
    async execute(interaction: CommandInteraction) {
        await startBaptise(interaction);
    },
};

export default command;
