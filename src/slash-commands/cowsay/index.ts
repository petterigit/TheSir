import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";
import {
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
} from "discord.js/typings/enums";
import { spawn } from "node:child_process";
import { SlashCommandModule } from "../../types";
import { createCodeBlock, MESSAGE_MAX_LENGTH } from "../../util";
import { quote } from "shell-quote";

const inputs: ApplicationCommandOptionData[] = [
    {
        type: ApplicationCommandOptionTypes.STRING,
        name: "message",
        description: "What does the cow say?",
        required: false,
    },
];

const Columns = 60;

const errorMessage = "Cow could not be found for comment.";

const cowsay = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    let message = interaction.options.getString("message");
    if (!message) message = "Moo moo mothertrucker!";

    try {
        const shellText = quote([message]);
        const cowsayProcess = spawn("cowsay", [`-W ${Columns}`, shellText], {
            shell: true,
        });

        cowsayProcess.stdout.on("data", async (data) => {
            const result = data.toString().substring(0, MESSAGE_MAX_LENGTH - 6);
            const fixedResult = cowTextFix(result);
            await interaction.editReply({
                content: createCodeBlock(fixedResult),
            });
        });

        cowsayProcess.stderr.on("data", async () => {
            await interaction.editReply({
                content: errorMessage,
            });
        });
    } catch (e) {
        await interaction.editReply({
            content: errorMessage,
        });
    }
};

const cowTextFix = (text: string) => {
    const lines = text.split("\n");
    const fixedLines = lines.map((line) => {
        if (line[0] === " ") return line;
        if (line.length > Columns) {
            const lastChar = line.at(-1);
            return line.substring(0, Columns + 1) + " " + lastChar;
        }
        return line;
    });
    return fixedLines.join("\n");
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
