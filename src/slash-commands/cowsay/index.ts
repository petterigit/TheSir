import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";
import {
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
} from "discord.js/typings/enums";
import { spawn } from "node:child_process";
import { SlashCommandModule } from "../../types";
import { createCodeBlock } from "../../util";
import { quote } from "shell-quote";

const inputs: ApplicationCommandOptionData[] = [
    {
        type: ApplicationCommandOptionTypes.STRING,
        name: "message",
        description: "What does the cow say?",
        required: false,
    },
];

const errorMessage = "Cow could not be found for comment.";

const cowsay = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    let message = interaction.options.getString("message");
    if (!message) message = "Moo moo mothertrucker!";

    try {
        const shellCommand = quote([message]);
        const cowsayProcess = spawn("cowsay", [shellCommand], {
            shell: true,
        });

        cowsayProcess.stdout.on("data", (data) => {
            interaction.editReply({
                content: createCodeBlock(data.toString()),
            });
        });

        cowsayProcess.stderr.on("data", () => {
            interaction.editReply({
                content: errorMessage,
            });
        });
    } catch (e) {
        interaction.editReply({
            content: errorMessage,
        });
    }
};

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["cowsay"],
        description: "Moo?",
        options: inputs,
    },
    async execute(message: CommandInteraction) {
        await cowsay(message);
    },
};

export default command;
