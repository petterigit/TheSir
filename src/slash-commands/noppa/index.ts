import { DiceRoller } from "dice-roller-parser";
import {
    ApplicationCommandOptionData,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChatInputCommandInteraction,
} from "discord.js";
import { SlashCommandModule } from "../../types";

const diceRoller = new DiceRoller();

const inputs: ApplicationCommandOptionData[] = [
    {
        type: ApplicationCommandOptionType.String,
        name: "formula",
        description: "Roll20 dice formula",
        required: true,
    },
];

const noppa = async (
    interaction: ChatInputCommandInteraction
): Promise<void> => {
    await interaction.deferReply();
    const dieString = interaction.options.getString("formula");
    if (!dieString) {
        interaction.editReply("No formula provided");
        return;
    }

    let value = 0;

    try {
        value = diceRoller.rollValue(dieString);
    } catch (err) {
        await interaction.editReply(
            `\`${dieString}\` is not a valid Roll20 formula`
        );
        return;
    }

    await interaction.editReply(`Rolled \`${dieString}\` for **${value}**`);
    return;
};

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: ["dice"],
        description: "Roll a dice!",
        options: inputs,
    },
    async execute(interaction: ChatInputCommandInteraction) {
        await noppa(interaction);
    },
};

export default command;
