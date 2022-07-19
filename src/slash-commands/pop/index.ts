import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";
import {
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
} from "discord.js/typings/enums";
import { SlashCommandModule } from "../../types";

const inputs: ApplicationCommandOptionData[] = [
    {
        type: ApplicationCommandOptionTypes.INTEGER,
        name: "size",
        description: "Size of the pops",
        minValue: 1,
        maxValue: 14,
        required: true,
    },
];

const pop = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    try {
        let pops = "\u2800\n";
        const seis = "<:seis:690617911748067368>";
        const amount = interaction.options.getInteger("size");

        if (amount > 0 && amount <= 14) {
            for (let i = 0; i < amount; i++) {
                for (let i = 0; i < amount; i++) {
                    pops = pops + "||pop!||";
                }
                pops = pops + "\n";
            }
        } else if (amount > 14) {
            pops = seis + " nyt oli liian thiccc, max pop on 14.";
        } else {
            pops = "||pop!||";
        }
        interaction.editReply(pops);
    } catch (error) {
        console.log(error);
    }
};

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["pop"],
        description: "Virtual bubblewrap",
        options: inputs,
    },
    async execute(interaction: CommandInteraction) {
        await pop(interaction);
    },
};

export default command;
