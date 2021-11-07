import { APIRole } from "discord-api-types";
import {
    CommandInteraction,
    GuildMember,
    MessageAttachment,
    Role,
    User,
} from "discord.js";

import * as Praise from "./praise";
import {
    getNicknameOrName,
    InputTypes,
    createEveryoneMention,
    createRoleMentionWithId,
    createUserMentionWithId,
} from "../../util";

const MESSAGE_OPTIONS = { mention: "mention", message: "message" };
const inputs = [
    {
        type: InputTypes.Mentionable,
        name: MESSAGE_OPTIONS.mention,
        description: "Who should be praised or shamed",
        required: true,
    },
    {
        type: InputTypes.String,
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
    if ((<GuildMember>mention).user) {
        messageText += `${createUserMentionWithId(
            (<GuildMember>mention).user.id
        )}!`;
    } else {
        if (
            (<Role | APIRole>mention).name &&
            (<Role | APIRole>mention).name === "@everyone"
        ) {
            messageText += `${createEveryoneMention()}!`;
        } else {
            messageText += `everyone with the role ${createRoleMentionWithId(
                mention.id
            )}!`;
        }
    }
    return messageText;
};

module.exports = {
    data: {
        type: 1,
        name: ["praise", "shame"],
        description:
            "Everyone deserves some praise (or shame) every once in a while",
        options: inputs,
    },
    async execute(message: CommandInteraction) {
        await praise(message);
    },
};
