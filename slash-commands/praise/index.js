const Praise = require("./praise.js");
const Discord = require("discord.js");
const {
    getNicknameOrName,
    InputTypes,
    createEveryoneMention,
    createRoleMentionWithId,
    createUserMentionWithId,
} = require("../../util.js");

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

const praise = async (interaction) => {
    await interaction.deferReply();
    const mention = interaction.options.getMentionable(MESSAGE_OPTIONS.mention);
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

    const attachment = new Discord.MessageAttachment(buffer, "reaction.jpg");

    try {
        interaction.editReply({ content: praiseText, files: [attachment] });
    } catch (error) {
        console.log("Failed to send message from praise");
    }
};

const getPraiseText = (interaction, mention, shouldShame) => {
    const praiser = getNicknameOrName(interaction);
    const actionType = shouldShame ? "shames" : "praises";
    let messageText = `${praiser} ${actionType} `;
    if (mention.user) {
        messageText += `${createUserMentionWithId(mention.user.id)} !`;
    } else {
        if (mention.name === "@everyone") {
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
    async execute(message) {
        await praise(message);
    },
};
