import * as Praise from "./praise";

import {
    ApplicationCommandOptionData,
    CommandInteraction,
    GuildMember,
    MessageAttachment,
    Role,
    User,
} from "discord.js";
import {
    createEveryoneMention,
    createRoleMentionWithId,
    createUserMentionWithId,
    getNicknameOrName,
    isMentionGuildMember,
    isMentionRole,
} from "../../util";

import { APIRole } from "discord-api-types/v9";
import { SlashCommandModule } from "../../types";
import {
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
} from "discord.js/typings/enums";

const MESSAGE_OPTIONS = { mention: "mention", message: "message" };
const inputs: ApplicationCommandOptionData[] = [
    {
        type: ApplicationCommandOptionTypes.MENTIONABLE,
        name: MESSAGE_OPTIONS.mention,
        description: "Who should be praised or shamed",
        required: true,
    },
    {
        type: ApplicationCommandOptionTypes.STRING,
        name: MESSAGE_OPTIONS.message,
        description: "Optional custom message",
        required: false,
    },
];

const praise = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const mention = interaction.options.getMentionable(
        MESSAGE_OPTIONS.mention
    ) as GuildMember | Role | APIRole | User;
    const shouldShame = interaction.commandName !== "praise";
    const praiseText = getPraiseText(interaction, mention, shouldShame);
    const customMessage = interaction.options.getString(
        MESSAGE_OPTIONS.message
    );

    let buffer = null;
    try {
        buffer = await Praise.generatePraise(shouldShame, customMessage);
    } catch (error) {
        interaction.editReply({ content: "Praise machine is broken" });
        console.log(error);
        return;
    }

    const attachment = new MessageAttachment(buffer, "reaction.jpg");

    try {
        interaction.editReply({ content: praiseText, files: [attachment] });
    } catch (error) {
        console.log("Failed to send message from praise");
    }
};

const getPraiseText = (
    interaction: CommandInteraction,
    mention: GuildMember | Role | APIRole | User,
    shouldShame: boolean
) => {
    const praiser = getNicknameOrName(interaction);
    const actionType = shouldShame ? "shames" : "praises";
    let messageText = `${praiser} ${actionType} `;
    if (isMentionGuildMember(mention)) {
        messageText += `${createUserMentionWithId(mention.user.id)}!`;
    } else {
        if (isMentionRole(mention) && mention.name === "@everyone") {
            messageText += `${createEveryoneMention()}!`;
        } else {
            messageText += `everyone with the role ${createRoleMentionWithId(
                mention.id
            )}!`;
        }
    }
    return messageText;
};

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["praise", "shame"],
        description:
            "Everyone deserves some praise (or shame) every once in a while",
        options: inputs,
    },
    async execute(message: CommandInteraction) {
        await praise(message);
    },
};

export default command;
