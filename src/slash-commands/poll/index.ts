import {
    ChatInputCommandInteraction,
    ButtonBuilder,
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ApplicationCommandType,
} from "discord.js";
import { createButton } from "../../util";
import random from "lodash/random";

import { getNicknameOrName, randomColor } from "../../util";
import { SlashCommandModule } from "../../types";

// Max 5 buttons per row, max 5 rows -> 25
// -1 for question
// -1 for rainbow mode
const MAX_BUTTONS = 23;
const MAX_BUTTONS_PER_ROW = 5;
const MAX_BUTTON_LABEL = 80;
const COMMAND_NAME = "poll";

const constants = {
    commandName: COMMAND_NAME,
};

const poll = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const buttons = createButtons(interaction);
    const actionRows = createActionRows(buttons);

    const title = interaction.options.getString("title");
    const user = getNicknameOrName(interaction);

    interaction.editReply({
        content: `${user} started a poll!`,
        components: actionRows,
        embeds: [
            {
                title: title,
                color: randomColor() as number,
                timestamp: new Date().toString(),
            },
        ],
    });
};

const createActionRows = (
    buttons: ButtonBuilder[]
): ActionRowBuilder<ButtonBuilder>[] => {
    const actionRows: ActionRowBuilder<ButtonBuilder>[] = [];
    for (
        let i = 0, limit = buttons.length;
        i < limit;
        i += MAX_BUTTONS_PER_ROW
    ) {
        const actionRow = new ActionRowBuilder<ButtonBuilder>();
        const row = buttons.slice(i, i + MAX_BUTTONS_PER_ROW);
        row.map((button) => actionRow.addComponents(button));
        actionRows.push(actionRow);
    }
    return actionRows;
};

const createButtons = (interaction: ChatInputCommandInteraction) => {
    const indexes = Array(MAX_BUTTONS)
        .fill(0)
        .map((_, i) => i);

    const inputs = indexes.reduce((inputs, i) => {
        const input = interaction.options.getString(optionName(i));
        if (input) {
            const shortenedInput = input.slice(0, MAX_BUTTON_LABEL);
            inputs.push({
                id: `${inputs.length} ${shortenedInput}`,
                name: shortenedInput,
            });
        }

        return inputs;
    }, []);

    const rainbowMode = interaction.options.getBoolean("rainbow-mode");

    const buttons = inputs.map((input) =>
        createButton(
            `${COMMAND_NAME} ${input.id}`,
            input.name,
            rainbowMode ? random(0, 5) : undefined
        )
    );
    return buttons;
};

const optionName = (index: number) => `option-${index + 1}`;

const createInputs = (numberOfInputs: number) => {
    const inputs = Array(numberOfInputs)
        .fill(0)
        .map((_, i) => ({
            type: 3,
            name: optionName(i),
            description: `${i + 1}. option`,
            required: i === 0,
        }));
    inputs.unshift({
        type: ApplicationCommandOptionType.String,
        name: "title",
        description: "The title of the poll",
        required: true,
    });
    inputs.push({
        type: ApplicationCommandOptionType.Boolean,
        name: "rainbow-mode",
        description: "🤗🌈",
        required: false,
    });
    return inputs;
};

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: COMMAND_NAME,
        description: "Create polls with your friends!",
        options: createInputs(MAX_BUTTONS),
    },
    constants: constants,
    async execute(interaction: ChatInputCommandInteraction) {
        await poll(interaction);
    },
};

export default command;
